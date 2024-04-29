import { useState } from "react";

import {
  Button,
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormGroup,
  Switch
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

import { User } from "@/types";

import { GROUPS_MAPS, RAW_GROUPS } from "@/constants";

import { DjangoApi } from "@/libs/fetch";


export interface AdministrationCardProps {
  user: User;
}

export function AdministrationCard({ user }: AdministrationCardProps) {
  const API = new DjangoApi();
  const [groups, setGroups] = useState<number[]>([...user.groups]);
  const [active, setActive] = useState<boolean>(user.is_active);
  const [staff, setStaff] = useState<boolean>(user.is_staff);

  const handlerCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const value = parseInt(event.target.value);
    if (checked) {
      setGroups((prevGroups) => [...prevGroups, value]);
    } else {
      setGroups((prevGroups) => prevGroups.filter((g) => g !== value));
    }
  };

  const handlerSubmit = () => {
    API.patch(
      `/authentication/users/${user.id}/`,
      (response) => {
        console.log(response);
      },
      () => {},
      {
        groups: groups,
        is_active: active,
        is_staff: staff,
      },
    );
  };

  return (
    <>
      <Paper elevation={5} sx={{ height: "100%" }}>
        <Box
          p={2}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Typography variant="h6">Amministrazione</Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={() => setActive(!active)}
                />
              }
              label="Attivo"
            />
            <FormHelperText>L&lsquo;utente potra accedere all&lsquo;applicazione ma non potrà utilizzare utilizzarla</FormHelperText>

            <FormControlLabel
              control={
                <Switch checked={staff} onChange={() => setStaff(!staff)} />
              }
              label="Staff user"
            />

            <FormHelperText>L&lsquo;utente avrà accesso alla pagina amministrazione, bisogna aggiungere i permessi specifici per l&lsquo;utente</FormHelperText>
          </FormGroup>

          {staff && (
            <Box mt={2}>
              <Typography variant="h6">Permessi</Typography>
              <FormGroup sx={{ ml: 2 }}>
                {RAW_GROUPS.map((e) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={groups.includes(e.key)}
                        onChange={(e) => handlerCheck(e, e.target.checked)}
                        value={e.key}
                      />
                    }
                    label={e.label}
                    key={e.key}
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
