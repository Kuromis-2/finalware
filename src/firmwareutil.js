//convert the import statement to a import statement using
const {
  DfuUpdates,
  DfuTransportUsbSerial,
  DfuOperation,
} = require("pc-nrf-dfu-js");
const log = require('electron-log');
async function updateMouse(port, firmwareFilePath) {
  log.info(`Flashing ${firmwareFilePath} to ${port}`);
  if (port == null) log.error("Port is null");
  if (firmwareFilePath == null) log.error("Firmware path is null");
  console.log(port, firmwareFilePath);
  let serialNumber = port.serialNumber;

  const dfuUpdates = await DfuUpdates.fromZipFilePath(firmwareFilePath);
  const serialPort = new DfuTransportUsbSerial(serialNumber, 16);
  const dfuOperation = new DfuOperation(dfuUpdates, serialPort);

  await dfuOperation.start(true);
}

module.exports.updateMouse = updateMouse;
