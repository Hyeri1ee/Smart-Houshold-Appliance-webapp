import "../../styles/components/generic/header.css"
import {getDecodedJwt} from "../../helpers/jwt/DecodeJwt";

const decoded = getDecodedJwt();

function Header() {
  return (
    <header id="page-header">
      <p>Hello, {decoded.first_name}!</p>
    </header>
  )
}

export default Header;