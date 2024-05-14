import { useEffect, useState } from "react";

import { styled, lighten } from "@mui/material/styles";

import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { FetchDispatchError, useDjangoApi } from "@/libs/fetch";
import {
  Paper,
  Box,
  Typography,
  Grid,
  OutlinedInput,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { Message } from "@/models/Ticket";
import { timeElapsed } from "@/libs/utils";

const MsgPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: lighten(theme.palette.primary.main, 0.95),
  padding: 8,
}));

export interface DrawerMessagesProps {
  id: string | null;
}

export function Messages({ id }: DrawerMessagesProps) {
  const api = useDjangoApi();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    id &&
      messages === null &&
      api.get(
        `/ticket/admin/${id}/message/`,
        (response) => {
          const data: Array<Message> = response.data;
          setMessages(data);
        },
        (error) => {
          throw new FetchDispatchError("Errore durante il recupero dei messaggio");
        },
      );
  }, [id, messages]);

  const handlerPost = () => {
    id &&
      api.post(
        `/ticket/admin/${id}/message/`,
        () => {
          setInputMessage("");
          setMessages(null);
        },
        (error) => {
          throw new FetchDispatchError("Errore durante il recupero dei messaggio");
        },
        {
          message: inputMessage,
        },
      );
  };

  return (
    <>
      <Box p={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Aggiungi un commento</InputLabel>
          <OutlinedInput
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handlerPost} edge="end">
                  <SendRoundedIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Aggiungi un commento"
            onChange={(element) => {
              setInputMessage(element.target.value);
            }}
            value={inputMessage}
          />
        </FormControl>

        <Box my={2} />

        <Grid container spacing={2}>
          {messages &&
            messages.map((msg, index) => (
              <Grid item xs={12} key={index}>
                <MsgPaper elevation={0}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">
                      {msg.author.first_name} {msg.author.last_name}
                    </Typography>
                    <FiberManualRecordRoundedIcon sx={{ height: 10, ml: 1 }} color="secondary" />
                    <Typography variant="caption" sx={{ position: "relative", top: 1 }}>
                      {timeElapsed(msg.created_at)}
                    </Typography>
                  </Box>

                  <Typography variant="body2">{msg.message}</Typography>
                </MsgPaper>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}

export default Messages;
