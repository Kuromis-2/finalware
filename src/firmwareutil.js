//convert the import statement to a import statement using 
const { DfuUpdates, DfuTransportUsbSerial, DfuOperation } = require('pc-nrf-dfu-js');

let firmwarePaths = {
    "1.2.0":
        "./resources/firmwares/fm6_dfu_package_1.2.0_iamadumbass_debounce.zip",
    "1.2.5": "./resources/firmwares/fm6_dfu_package_1.2.5.zip",
};

async function updateMouse(
    port,
    firmwareVersion
) {
    if (port == null) throw new Error("Port is null");
    if (firmwareVersion == null) throw new Error("Firmware version is null");
    if (firmwarePaths[firmwareVersion] == null)
        throw new Error("Firmware version does not exist");

    let serialNumber = port.serialNumber;

    const dfuUpdates = await DfuUpdates.fromZipFilePath(firmwarePaths[firmwareVersion]);
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