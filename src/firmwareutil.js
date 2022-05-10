//convert the import statement to a import statement using
const {
    DfuUpdates,
    DfuTransportUsbSerial,
    DfuOperation,
} = require("pc-nrf-dfu-js");

async function updateMouse(port, firmwareFilePath) {
    if (port == null) throw "Port is null";
    if (firmwareFilePath == null) throw "Firmware path is null";

    let serialNumber = port.serialNumber;

    const dfuUpdates = await DfuUpdates.fromZipFilePath(firmwareFilePath);
    const serialPort = new DfuTransportUsbSerial(serialNumber, 16);
    const dfuOperation = new DfuOperation(dfuUpdates, serialPort);

    await dfuOperation.start(true);
}

module.exports.updateMouse = updateMouse;
