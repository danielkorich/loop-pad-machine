import "./App.css";
import LoopMachine from "./components/LoopMachine";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "80vh", marginTop: "40px" }}
      >
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={false} sm={3} md={4}></Grid>
          <Grid item xs={10} sm={6} md={4}>
            <LoopMachine />
          </Grid>
          <Grid item xs={false} sm={3} md={4}></Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
