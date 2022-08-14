const button = document.getElementById("exit");
function closeapp() {
    window.electronAPI.exit();
}
async function checkCom() {
    return await window.firmware.getPorts();
}
async function lookUpVersions() {
    return await window.firmware.getVersions();
}
async function updateMouseInBrowser() {
    console.log(localStorage.getItem("version"), localStorage.getItem("port"));
    let success = false;

    try {
        await window.firmware.updateMouse(JSON.parse(localStorage.getItem("port")), localStorage.getItem("firmwareVersion"));
        success = true;
    } catch (e) {
        localStorage.setItem("error", e);
    }
    if (success) {
        window.location.href = "./success.html";
    }
    else {
        window.location.href = "./failed.html";
    }
}

