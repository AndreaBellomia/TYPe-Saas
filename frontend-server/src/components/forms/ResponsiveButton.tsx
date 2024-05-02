import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export default styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
