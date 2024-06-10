import "../../styles/components/generic/header.css"
import {getDecodedJwt} from "../../helpers/DecodeJwt";

let decoded = getDecodedJwt();
if (!decoded) {
  decoded = {};
  decoded.first_name = "";
}

function Header() {
  return (
    <header id="page-header">
      <p>Hello, {decoded.first_name}!</p>
    </header>
  )
}

export default Header;