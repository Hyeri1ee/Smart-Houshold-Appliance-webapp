import "../../styles/components/generic/header.css"
import {getDecodedJwt} from "../../helpers/DecodeJwt";

const decoded = getDecodedJwt();
if (!decoded) {
  window.location.href = "/login";
}

function Header() {
  return (
    <header id="page-header">
      <p>Hello, {decoded.first_name}!</p>
    </header>
  )
}

export default Header;