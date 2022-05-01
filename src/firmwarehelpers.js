const { updateMouse } = require('./firmwareutil.js');
const { list } = require('serialport');

const os = require('os');
const { Console } = require('console');

async function getComPorts() {
  console.log("Retrieving all Serial Ports...");
  let ports = [];
  let portList = await list();
  for (const port of portList) {
      ports.push(port);
      console.log(`Port: ${port.path}`);
  }

  console.log(`Found ${ports.length} ports!`);
  return ports;
}

async function updateMouseHelper(pluggedInPorts, firmwareVersion){
  console.log('Updating mouse');

  if (Object.keys(pluggedInPorts).length === 0) {
    console.log('No new com ports plugged in empty object');
    return;
  }
  
  // If there are no plugged in ports, return
  if (pluggedInPorts.length === 0) {
    console.error('No new com ports plugged in empty array');
    return;
  }

  // If there is more than one plugged in port console error and return
  if (pluggedInPorts.length > 1) {
    console.error('More than one com port plugged in');
    return;
  }

  // If there is only one plugged in port, update the mouse
  if (pluggedInPorts.length === 1) {
    const port = pluggedInPorts[0];
    console.log(`Started update process with firmware version: ${firmwareVersion}`);
    let success = updateMouse(port, firmwareVersion);
    console.log("Finished update process");
    Console.log(success ? "Success" : "Failure");
    return success;
  }
  
}

// export getComPorts, updateMouseHelper
module.exports = {
  getComPorts,
  updateMouseHelper
}