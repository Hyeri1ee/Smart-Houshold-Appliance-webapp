const token = window.sessionStorage.token;

let haId = 0;

const base_url = "https://simulator.home-connect.com/api/"

const getDevices = async () => {
  const response = await fetch(`${base_url}/homeappliances`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const getAvailableDevices = async () => {
  const response = await fetch(`${base_url}/homeappliances/${haId}/programs/available`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const getActiveProgram = async () => {
  const response = await fetch(`${base_url}/homeappliances/${haId}/active`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const activateProgram = async (program) => {
  const response = await fetch(`${base_url}/homeappliances/${haId}/active`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ program })
  });
  const data = await response.json();
  console.log(data);
}

const stopActiveProgram = async () => {
  const response = await fetch('${base_url}/homeappliances/${haId}/active', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

export { getDevices, getAvailableDevices, getActiveProgram, activateProgram, stopActiveProgram };
