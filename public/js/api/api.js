const token = 1;

const getDevices = async () => {
  const response = await fetch('/homeappliances', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const getAvailableDevices = async () => {
  const response = await fetch('/api/available-devices', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const getActiveProgram = async () => {
  const response = await fetch('/api/active-program', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

const activateProgram = async (program) => {
  const response = await fetch('/api/change-program', {
    method: 'POST',
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
  const response = await fetch('/api/stop-program', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log(data);
}

export { getDevices, getAvailableDevices, getActiveProgram, activateProgram, stopActiveProgram };
