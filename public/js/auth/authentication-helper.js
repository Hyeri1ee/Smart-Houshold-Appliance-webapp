const url = "https://api.home-connect.com/security/oauth/authorize"
const client_id = "0C2C2EEDCB6888B979936AF90CA1AFC637165B64A7775F49C4B747AE7017C63A"
const response_type = "code"

export const getCode = () => {
  window.open(`${url}?client_id=${client_id}&response_type=${response_type}`, "_self");
}