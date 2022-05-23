const { updateMouse } = require("./firmwareutil.js");
const SerialPort = require("serialport");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const log = require("electron-log");
function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "Finalware");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "Finalware");
    }
    case "linux": {
      return path.join(process.env.HOME, ".Finalware");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}

const APP_DATA_PATH = getAppDataPath();
const FIRMWARE_PATH = path.join(APP_DATA_PATH, "firmware.zip");

async function downloadFirmware(firmwareVersion) {
  if (!firmwareVersion) throw new Error("firmwareVersion is null");
  const firmwareLookup =
    "https://raw.githubusercontent.com/Kuromis-2/newest-firmware/main/firmwarelookup.json";

  // Use axios to fetch data from firmwareLookup
  const { data } = await axios.get(firmwareLookup);

  const baseLink = data["baseLink"];
  const fileName = data[firmwareVersion]["fileName"];

  const firmwareLink = `${baseLink}${fileName}`;
  log.info(`Downloading firmware from ${firmwareLink}`);

  return new Promise((resolve, reject) => {
    axios({
      url: firmwareLink,
      method: "GET",
      responseType: "stream",
    }).then((response) => {
      // Use the stream to write the file to the filesystem
      response.data.pipe(fs.createWriteStream(FIRMWARE_PATH));
      response.data.on("end", () => {
        log.info("Download Completed");
        resolve();
      });
    }).catch(
      function(error) {
        if (error.response) {
          // Request made and server responded
          log.error(error.response.data);
          log.error(error.response.status);
          log.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          log.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          log.error('Error', error.message);
        }

      }
    );
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

    try {
      await updateMouse(port, FIRMWARE_PATH);
      console.log("Finished update process");
      console.log("Success");
    } catch (e) {
      console.log("Finished update process");
      console.log("Failure");
      throw e;
    }
  }
}

// export getComPorts, updateMouseHelper
module.exports = {
  getVersionLookup,
  getComPorts,
  getNewlyPluggedInPorts,
  updateMouseHelper,
};
