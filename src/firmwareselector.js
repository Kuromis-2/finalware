let selector = document.getElementById("firmwareSelector");
// Add event listener to selector that calls saveFirmwareVersion() when changed with this.value as argument on change
selector.addEventListener("change", function () {
    saveFirmwareVersion(this.value);
});

saveFirmwareVersion(selector.value);

function saveFirmwareVersion(version) {
    let value = selector.value;
    sendMessage(value);
    console.log("Saved firmware version: " + version);
}