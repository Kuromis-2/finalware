let firmwareSelector = document.getElementById("firmwareSelector");

// Add event listener to selector that calls saveFirmwareVersion() when changed with this.value as argument on change
firmwareSelector.addEventListener("change", function () {
    saveFirmwareVersion(this.value);
});

saveFirmwareVersion(firmwareSelector.value);

function saveFirmwareVersion(version) {
    let value = firmwareSelector.value;
    // Save firmware in local storage
    localStorage.setItem("firmwareVersion", version);
}