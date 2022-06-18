import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Home({ username, setUsername }) {
  return (
    <div className="Home">
      <div>Welcome!</div>
      <br />
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />
        <Button
          variant="outlined"
          color="success"
          onClick={() => {
            console.log(username);
          }}
        >
          See this users projects
        </Button>
      </div>
    </div>
  );
}

export default Home;
