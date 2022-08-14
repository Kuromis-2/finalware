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
    return await window.firmware.updateMouse(localStorage.getItem("port"), localStorage.getItem("version"));
}

