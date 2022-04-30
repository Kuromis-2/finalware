const button = document.getElementById('exit');
function closeapp() {
    window.electronAPI.setTitle("urmom");
}

function getports(){
    console.log("renderer.js");
    window.electronAPI.getports('beforePorts');
}