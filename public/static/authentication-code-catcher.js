const getCode = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams);

  if (!searchParams.has("grant_type") || !searchParams.has("code")) {
    console.log("no grant type or no code")
    // redirect(false);
  }

  window.sessionStorage.auth = searchParams.get("code");

  const url = "https://api.home-connect.com/security/oauth/token"
  const grant_type = "authorization_code"
  const code = window.sessionStorage.auth;
  const client_id = "0C2C2EEDCB6888B979936AF90CA1AFC637165B64A7775F49C4B747AE7017C63A"
  const client_secret = "CE5C4965F19A0106E435B75E7B0F4EDAE0F56F36A12210B1B91FFD31A1D0C779"

  const resp = await fetch(`${url}?grant_type=${grant_type}&code=${code}&client_id=${client_id}&client_secret=${client_secret}`, {
    content_type: "application/x-www-form-urlencoded",
    method: "POST",
    mode: "cors",
    cache: "no-cache",
  });

  if (!resp.ok || resp.statusCode !== 200) {
    console.log("bad resp");
    // redirect(false);
  }

  let data;
  try {
    data = await resp.json();
  } catch (e) {
    console.log("bad json")
    // redirect(false);
  }
  console.log(data);
  // redirect(true);
}

const redirect = (wasSuccessful) => {
  if (wasSuccessful === false) {
    window.location.replace("/login/failed");
  } else {

  }
}

getCode();