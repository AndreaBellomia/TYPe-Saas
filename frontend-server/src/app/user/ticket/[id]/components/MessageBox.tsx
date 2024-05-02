import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { useDjangoApi, FetchDispatchError } from "@/libs/fetch";
import { timeElapsed } from "@/libs/utils";

interface MessageBoxProps {
  id: string | string[];
}

export function MessageBox({ id }: MessageBoxProps) {
  const api = useDjangoApi();
  const [messages, setMessages] = useState<any[] | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    if (messages === null) {
      api.get(
        `/ticket/${id}/message/`,
        (response) => {
          const data: any[] = response.data;

          setMessages(data);
        },
        () => {
          throw new FetchDispatchError("Errore durante il recupero dei dati, riprova più tardi.");
        },
      );
    }
  }, [messages, id]);

  const handlerMessageSubmit = () => {
    api.post(
      `/ticket/${id}/message/`,
      () => {
        setInputMessage("");
        setMessages(null);
      },
      () => {
        throw new FetchDispatchError("Errore durante l'inserimento del messaggio");
      },
      {
        message: inputMessage,
      },
    );
  };
  return (
    <>
      <TextField
        label="Messaggio"
        id=""
        value={inputMessage}
        onChange={(e) => {
          setInputMessage(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handlerMessageSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      {messages &&
        messages.map((msg) => (
          <Paper elevation={0} key={msg.id} sx={{ mt: 2 }}>
            <Box p={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" color="initial">
                  {msg.author.first_name && msg.author.first_name && msg.author.first_name + " " + msg.author.last_name}
                </Typography>
                <Typography variant="subtitle2" color="initial">
                  {msg.author.email}
                </Typography>
              </Box>
              <Typography variant="body2" color="initial">
                {msg.message}
              </Typography>

              <Box sx={{ textAlign: "end" }}>
                <Typography variant="caption" color="initial">
                  {timeElapsed(msg.updated_at)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
    </>
  );
}

export default MessageBox;
