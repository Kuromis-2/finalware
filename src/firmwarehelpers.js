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
      return path.join(
        process.env.HOME,
        "Library",
        "Application Support",
        "Finalware"
      );
    }
    case "win32": {
      return path.join(process.env.APPDATA, "Finalware");
    }
    case "linux": {
      return path.join(process.env.HOME, ".Finalware");
    }
    default: {
      log.info("Unsupported platform, pls contact us.");
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
    })
      .then((response) => {
        // Use the stream to write the file to the filesystem
        response.data.pipe(fs.createWriteStream(FIRMWARE_PATH));
        response.data.on("end", () => {
          log.info("Download Completed");
          resolve();
        });
      })
      .catch(function (error) {
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
          log.error("Error", error.message);
        }
      });
  });
}

async function getVersionLookup() {
  log.info("look up version");
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
  log.info(`got version ${data}`);
}

async function getComPorts() {
  log.info("Retrieving all Serial Ports...");
  let ports = [];
  let portList = await SerialPort.list();
  for (const port of portList) {
    ports.push(port);
    log.info(`Port: ${port.path}`);
  }

  log.info(`Found ${ports.length} ports!`);
  return ports;
}

async function updateMouseHelper(port, firmwareVersion) {
  
  console.log(firmwareVersion);
  await downloadFirmware(firmwareVersion);
  log.info(`Started update process with firmware version: ${firmwareVersion}`);

  try {
    await updateMouse(port, FIRMWARE_PATH);
    log.info("Finished update process");
    log.info("Success");
  } catch (e) {
    log.error(`Error: ${e}`);
    throw e;
  }
}

// export getComPorts, updateMouseHelper
module.exports = {
  getVersionLookup,
  getComPorts,
  updateMouseHelper,
};
