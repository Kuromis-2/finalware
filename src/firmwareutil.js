const SerialPort = require('serialport');
//convert the import statement to a import statement using 
const { DfuUpdates, DfuTransportUsbSerial, DfuOperation } = require('pc-nrf-dfu-js');

let firmwarePaths = {
    "1.2.0":
        "../resources/firmwares/fm6_dfu_package_1.2.0_iamadumbass_debounce.zip",
    "1.2.5": "../resources/firmwares/fm6_dfu_package_1.2.5.zip",
};

async function getComPorts() {
    console.log("Retrieving all Serial Ports...");
    let ports = [];
    let portList = await SerialPort.list();

    for (const port of portList) {
        ports.push(port);
        console.log(`Port: ${port.path}`);
    }

    console.log(`Found ${ports.length} ports!`);
    return ports;
}

function getNewlyPluggedInPorts(
    beforePorts,
    afterPorts
) {
    if (beforePorts == null) throw new Error("beforePorts is null");
    if (afterPorts == null) throw new Error("afterPorts is null");
    if (afterPorts.length < beforePorts.length)
        throw new Error("afterPorts.length < beforePorts.length");
    if (afterPorts.length === 0) throw new Error("afterPorts.length === 0");

    let newPorts = [];
    for (const port of afterPorts) {
        if (!beforePorts.includes(port)) {
            newPorts.push(port);
        }
    }

    return newPorts;
}

async function updateMouse(
    port,
    firmwareVersion
) {
    if (port == null) throw new Error("Port is null");
    if (firmwareVersion == null) throw new Error("Firmware version is null");
    if (firmwarePaths[firmwareVersion] == null)
        throw new Error("Firmware version does not exist");

    let serialNumber = port.serialNumber;

    const dfuUpdates = await DfuUpdates.fromZipFilePath(firmwareVersion);
    const serialPort = new DfuTransportUsbSerial(serialNumber, 16);
    const dfuOperation = new DfuOperation(dfuUpdates, serialPort);

    try {
        await dfuOperation.start(true);
        console.log("Success!");
    } catch (e) {
        console.log(e);
    }
}


module.exports.getComPorts = getComPorts;
module.exports.getNewlyPluggedInPorts = getNewlyPluggedInPorts;
module.exports.updateMouse = updateMouse;