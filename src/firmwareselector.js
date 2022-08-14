let firmwareSelector = document.getElementById("firmwareSelector");

// listen for change event on firmwareSelector
firmwareSelector.addEventListener("change", function (event) {
    // pass to saveFirmwareVersion()
    console.log("change even fired");
    console.log(event.target.value);
    saveFirmwareVersion(event.target.value);
} );


function saveFirmwareVersion(version) {
    // Save firmware in local storage
    
    console.log("saved to " + version);
    localStorage.setItem("firmwareVersion", version);
}
