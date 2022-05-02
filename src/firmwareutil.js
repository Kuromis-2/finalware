//convert the import statement to a import statement using
const {
    DfuUpdates,
    DfuTransportUsbSerial,
    DfuOperation,
} = require("pc-nrf-dfu-js");

async function updateMouse(port, firmwareFilePath) {
    if (port == null) throw new Error("Port is null");
    if (firmwareFilePath == null) throw new Error("Firmware path is null");

    let serialNumber = port.serialNumber;

    const dfuUpdates = await DfuUpdates.fromZipFilePath(firmwareFilePath);
    const serialPort = new DfuTransportUsbSerial(serialNumber, 16);
    const dfuOperation = new DfuOperation(dfuUpdates, serialPort);

    try {
        await dfuOperation.start(true);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

module.exports.updateMouse = updateMouse;
