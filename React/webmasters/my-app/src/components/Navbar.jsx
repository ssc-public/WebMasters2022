import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function Navbar() {
  return (
    <div className="Navbar">
      <Link className="router-link" to="/">
        <Button variant="contained">Home</Button>
      </Link>
      <Link className="router-link" to="/projects">
        <Button variant="contained">Projects</Button>
      </Link>
    </div>
  );
}

export default Navbar;
