const button = document.getElementById('exit');
function closeapp() {
    window.electronAPI.setTitle("urmom");
}

async function savePortsBrowser(key){
    console.log("renderer.js");
    localStorage.setItem(key, JSON.stringify(await window.firmware.getPorts()));
    // Get ports from storage and log them in one line
    console.log(`${key}: ${localStorage.getItem(key)}`);
}

async function loadPortsBrowser(key){
    console.log("renderer.js");
    const ports = JSON.parse(localStorage.getItem(key));
    console.log(`${key}: ${JSON.stringify(ports)}`);
    return ports;
}

async function updateMouseBrowser() {
    const beforePorts = localStorage.getItem("beforePorts");
    const afterPorts = localStorage.getItem("afterPorts");

    console.log(JSON.stringify(beforePorts, null, 4));
    console.log(JSON.stringify(afterPorts, null, 4));

    const pluggedInPorts = JSON.stringify(window.firmware.getNewPorts(beforePorts, afterPorts));

    // Get firmware version from local storage
    const firmwareVersion = localStorage.getItem("firmwareVersion");

    await window.firmware.updateMouse(pluggedInPorts, firmwareVersion);
}

