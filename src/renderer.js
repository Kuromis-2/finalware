const button = document.getElementById("exit");
function closeapp() {
    window.electronAPI.exit();
}

async function savePortsBrowser(key) {
    localStorage.setItem(key, JSON.stringify(await window.firmware.getPorts()));
}

function loadPortsBrowser(key) {
    const ports = JSON.parse(localStorage.getItem(key));
    return ports;
}

async function lookUpVersions() {
    return await window.firmware.getVersions();
}

async function updateMouseBrowser() {
    const beforePorts = loadPortsBrowser("beforePorts");
    const afterPorts = loadPortsBrowser("afterPorts");

    const pluggedInPorts = await window.firmware.getNewPorts(
        beforePorts,
        afterPorts
    );

    // Get firmware version from local storage
    const firmwareVersion = localStorage.getItem("firmwareVersion");

    let success = false;

    try {
        await window.firmware.updateMouse(pluggedInPorts, firmwareVersion);
        success = true;
    } catch (e) {
        localStorage.setItem("error", e);
   
    }

    window.location.href = success ? "success.html" : "failed.html";
}
