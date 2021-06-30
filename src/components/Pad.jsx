import React from "react";
import {
  Button,
  createMuiTheme,
  Grid,
  makeStyles,
  MuiThemeProvider,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  square: {
    position: "relative",
    "&::before": {
      display: "block",
      content: "''",
      paddingBottom: "100%",
    },
  },
  pad: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    width: "90%",
    height: "90%",
    margin: "5%",
    fontFamily: "Franklin Gothic",
    fontWeight: "bold",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#055FAF",
    },
    secondary: {
      main: "#C709EB",
    },
  },
});

const Pad = ({ pad, changePadStatus }) => {
  const classes = useStyles();
  return (
    <Grid item xs={4} sm={4} md={4} className={classes.square}>
      <MuiThemeProvider theme={theme}>
        <Button
          variant="contained"
          color={pad.isOn ? "secondary" : "primary"}
          className={classes.pad}
          onClick={changePadStatus}
        >
          {pad.caption}
        </Button>
      </MuiThemeProvider>
    </Grid>
  );
};

export default Pad;
