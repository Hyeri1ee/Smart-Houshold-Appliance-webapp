import { getCode } from "../auth/authentication-helper.js";
import { getDevices, getAvailableDevices, getActiveProgram, activateProgram, stopActiveProgram } from '../api/api.js';

const signInButton = document.getElementById("sign-in");
signInButton.addEventListener("click", getCode);

document.getElementById('show-all-devices').addEventListener('click', getDevices);
document.getElementById('show-available-devices').addEventListener('click', getAvailableDevices);
document.getElementById('get-active-program').addEventListener('click', getActiveProgram);
document.getElementById('change-active-program').addEventListener('click', () => {
  const program = prompt('Enter new program:');
  activateProgram(program);
});
document.getElementById('stop-active-program').addEventListener('click', stopActiveProgram);