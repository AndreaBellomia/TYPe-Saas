"use client";
import { useEffect, useState } from "react";

import {
  Button,
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormGroup,
  Switch,
} from "@mui/material";

import { UserModel, PermissionGroup, PermissionGroupTag } from "@/models/User";

import { useDjangoApi } from "@/libs/fetch";
import { snack } from "@/libs/SnakClient";

export interface AdministrationCardProps {
  user: UserModel;
}

export function AdministrationCard({ user }: AdministrationCardProps) {
  const api = useDjangoApi();
  const [groups, setGroups] = useState<PermissionGroup[]>([...user.groups]);
  const [active, setActive] = useState<boolean>(user.is_active);
  const [staff, setStaff] = useState<boolean>(user.is_staff);

  const handlerCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const value = event.target.value as PermissionGroup;
    if (checked) {
      setGroups((prevGroups) => [...prevGroups, value]);
    } else {
      setGroups((prevGroups) => prevGroups.filter((g) => g !== value));
    }
  };

  const handlerSubmit = () => {
    api.patch(
      `/authentication/users/${user.id}/`,
      (response) => {
        snack.success("Utente aggiornato correttamente");
        snack.info("Ricorda di rieseguire il login per aggiornare l'interfaccia");
      },
      () => {},
      {
        groups: groups,
        is_active: active,
        is_staff: staff,
      },
    );
  };

  useEffect(() => {
    if (!staff) {
      setGroups([]);
    }
  }, [staff]);

  return (
    <>
      <Paper elevation={5} sx={{ height: "100%" }}>
        <Box p={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">Amministrazione</Typography>
          <Typography variant="body2">
            Le modifiche apportate ad un utente saranno visibili al successivo login.
          </Typography>
          <Typography variant="body2">
            Ricorda di avvisare l&lsquo;utente per far si che aggiorni l&lsquo;interfaccia.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={<Switch checked={active} onChange={() => setActive(!active)} />}
              label="Attivo"
            />
            <FormHelperText>
              Se non attivo l&lsquo;utente potra accedere all&lsquo;applicazione ma non potrà utilizzare utilizzarla
            </FormHelperText>

            <FormControlLabel
              control={<Switch checked={staff} onChange={() => setStaff(!staff)} />}
              label="Staff user"
            />

            <FormHelperText>
              L&lsquo;utente avrà accesso alla pagina amministrazione, bisogna aggiungere i permessi specifici per
              l&lsquo;utente
            </FormHelperText>
          </FormGroup>

          {staff && (
            <Box mt={2}>
              <Typography variant="h6">Permessi</Typography>
              <FormGroup sx={{ ml: 2 }}>
                {Object.values(PermissionGroup).map((value) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={groups.includes(value)}
                        onChange={(e) => handlerCheck(e, e.target.checked)}
                        value={value}
                      />
                    }
                    label={PermissionGroupTag[value]}
                    key={value}
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          <Box sx={{ marginTop: "auto", textAlign: "right" }}>
            <Button variant="contained" onClick={handlerSubmit}>
              Aggiorna
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default AdministrationCard;
