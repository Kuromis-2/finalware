const button = document.getElementById('exit');
function closeapp() {
    window.electronAPI.setTitle("urmom");
}

function savePortsBrowser(key){
    console.log("renderer.js");
    window.firmware.savePorts(key)
}

let selector = document.getElementById("firmwareSelector");
// Add event listener to selector that calls saveFirmwareVersion() when changed with this.value as argument on change
selector.addEventListener("change", function () {
    saveFirmwareVersion(this.value);
});

saveFirmwareVersion(selector.value);

function saveFirmwareVersion(version) {
    let value = selector.value;
    window.localStorage.save(value);
    
}
