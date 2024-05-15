import { getCode } from "../auth/authentication-helper.js";

const signInButton = document.getElementById("sign-in");
signInButton.addEventListener("click", getCode);