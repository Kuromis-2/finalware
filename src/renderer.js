const button = document.getElementById('exit');
function closeapp() {
    window.electronAPI.setTitle("urmom");
}

async function savePortsBrowser(key){
    localStorage.setItem(key, JSON.stringify(await window.firmware.getPorts()));
}

async function loadPortsBrowser(key){
    const ports = JSON.parse(localStorage.getItem(key));
    return ports;
}

async function updateMouseBrowser() {
    const beforePorts = localStorage.getItem("beforePorts");
    const afterPorts = localStorage.getItem("afterPorts");

    const pluggedInPorts = JSON.stringify(window.firmware.getNewPorts(beforePorts, afterPorts));

    // Get firmware version from local storage
    const firmwareVersion = localStorage.getItem("firmwareVersion");

    const success = await window.firmware.updateMouse(pluggedInPorts, firmwareVersion);
}

