const button = document.getElementById('exit');
function closeapp() {
    window.electronAPI.setTitle("urmom");
}

function getports(){
    window.firmware.getports('beforePorts');
}