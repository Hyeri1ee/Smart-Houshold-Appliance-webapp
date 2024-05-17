const current_time = document.getElementById("current-time");
const active_tariff = document.getElementById("active-tariff");
const electricity_delivered = document.getElementById("electricity-delivered");
const electricity_usage = document.getElementById("electricity-usage");
const electricity_delivered_1 = document.getElementById("electricity-delivered-1");
const electricity_delivered_2 = document.getElementById("electricity-delivered-2");
const electricity_used_1 = document.getElementById("electricity-used-1");
const electricity_used_2 = document.getElementById("electricity-used-2");
const gas = document.getElementById("gas");

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const updateData = async () => {
  const resp = await fetch("/api/data/live");
  const stats = JSON.parse(await resp.json());

  current_time.textContent = stats.time;
  active_tariff.textContent = stats.active_tariff;
  electricity_delivered.textContent = stats.current_electricity_delivery;
  electricity_usage.textContent = stats.current_electricity_usage;
  electricity_delivered_1.textContent = stats.electricity_delivered_1;
  electricity_delivered_2.textContent = stats.electricity_delivered_2;
  electricity_used_1.textContent = stats.electricity_used_1;
  electricity_used_2.textContent = stats.electricity_used_2;
  gas.textContent = stats.gas;

  await sleep(1000);
}

const runUpdateLoop = async () => {
  while (1) {
    await updateData();
  }
}

runUpdateLoop();