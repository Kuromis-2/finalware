const { updateMouse } = require("./firmwareutil.js");
const SerialPort = require("serialport");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const { resolve } = require("path");

const FIRMWARE_PATH = "firmware.zip";

async function downloadFirmware(firmwareVersion) {
    if (!firmwareVersion) throw new Error("firmwareVersion is null");
    const firmwareLookup =
        "https://raw.githubusercontent.com/Kuromis-2/newest-firmware/main/firmwarelookup.json";

    // Use axios to fetch data from firmwareLookup
    const { data } = await axios.get(firmwareLookup);

    console.log(`data: ${JSON.stringify(data)}`);

    const baseLink = data["baseLink"];
    const fileName = data[firmwareVersion]["fileName"];

    const firmwareLink = `${baseLink}${fileName}`;
    console.log(`Downloading firmware from ${firmwareLink}`);

    return new Promise((resolve, reject) => {
        axios({
            url: firmwareLink,
            method: "GET",
            responseType: "stream",
        }).then((response) => {
            // Use the stream to write the file to the filesystem
            response.data.pipe(fs.createWriteStream(FIRMWARE_PATH));
            response.data.on("end", () => {
                console.log("Download Completed");
                resolve();
            });
        });
    });
}

async function getVersionLookup() {
    const versionLookup =
        "https://raw.githubusercontent.com/Kuromis-2/newest-firmware/main/versionlookup.json";

    // Fetch data from versionLookup with a https request and return JSON
    return new Promise((resolve, reject) => {
        https.get(versionLookup, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                resolve(JSON.parse(data));
            });
        });
    });
}

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

function getNewlyPluggedInPorts(beforePorts, afterPorts) {
    if (beforePorts == null) throw new Error("beforePorts is null");
    if (afterPorts == null) throw new Error("afterPorts is null");
    if (afterPorts.length < beforePorts.length)
        throw new Error("afterPorts.length < beforePorts.length");
    if (afterPorts.length === 0) throw new Error("afterPorts.length === 0");

    // Save only newly plugged in ports and use JSON.stringyfy to compare
    const newPorts = [];
    for (const port of afterPorts) {
        if (beforePorts.find((p) => p.path === port.path) == null) {
            newPorts.push(port);
        }
    }

    return newPorts;
}

async function updateMouseHelper(pluggedInPorts, firmwareVersion) {
    if (Object.keys(pluggedInPorts).length === 0) {
        throw "No new com ports plugged in empty object";
    }

    // If there are no plugged in ports, return
    if (pluggedInPorts.length === 0) {
        throw "No new com ports plugged in empty array";
    }

    // If there is more than one plugged in port console error and return
    if (pluggedInPorts.length > 1) {
        throw "More than one com port plugged in";
    }

    // If there is only one plugged in port, update the mouse
    if (pluggedInPorts.length === 1) {
        const port = pluggedInPorts[0];
        await downloadFirmware(firmwareVersion);
        console.log(
            `Started update process with firmware version: ${firmwareVersion}`
        );
        let success = await updateMouse(port, FIRMWARE_PATH);
        console.log("Finished update process");
        console.log(success ? "Success" : "Failure");
        return success;
    }
}

// export getComPorts, updateMouseHelper
module.exports = {
    getVersionLookup,
    getComPorts,
    getNewlyPluggedInPorts,
    updateMouseHelper,
};
