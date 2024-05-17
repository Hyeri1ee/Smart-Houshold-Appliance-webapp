const getCode = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams);

  if (!searchParams.has("grant_type") || !searchParams.has("code")) {
    console.log("no grant type or no code")
    redirect(false);
  }

  window.sessionStorage.auth = searchParams.get("code");

  const url = "https://api.home-connect.com/security/oauth/token"

  const grant_type = "authorization_code"
  const code = window.sessionStorage.auth;
  const client_id = "0C2C2EEDCB6888B979936AF90CA1AFC637165B64A7775F49C4B747AE7017C63A"
  const client_secret = "CE5C4965F19A0106E435B75E7B0F4EDAE0F56F36A12210B1B91FFD31A1D0C779"

  const req_data = {
    "grant_type": grant_type,
    "code": code,
    "client_id": client_id,
    'client_secret': client_secret,
  }

  const resp = await fetch(
    `${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(req_data).toString()
    }
  );

  let data;
  try {
    data = await resp.json();
  } catch (e) {
    await redirect(false);
  }

  try {
    window.sessionStorage.token = data.access_token;
    window.sessionStorage.removeItem("auth");
    window.localStorage.refresh_token = data.refresh_token;
  } catch (e) {
    await redirect(false);
  }

  await redirect(true);
}

const redirect = async (wasSuccessful) => {
  if (wasSuccessful === true) {
    await new Promise(r => setTimeout(r, 1000));
    window.location.replace("/");
  } else {
    await new Promise(r => setTimeout(r, 1000));
    window.location.replace("/login/failed");
  }
}

getCode();