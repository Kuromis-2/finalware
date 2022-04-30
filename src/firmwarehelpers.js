const { getComPorts, getNewlyPluggedInPorts, updateMouse } = require('./firmwareutil.js');
//log all the imports from first line of code

// Function that takes in a key and saves the com ports as json to local storage
// Called by onload to save the ports before and after plugging in the mouse
// Saving both lists to beforePorts and afterPorts
const os = require('os');
const storage = require('electron-json-storage');
const { Console } = require('console');

storage.setDataPath(os.tmpdir());

async function saveComPorts(key){
  const dataPath = storage.getDataPath();
  console.log(dataPath);
  const comPorts = await getComPorts();
  //store comports to locals storage with electron-json-storage
  console.log(comPorts);
  storage.set(key, comPorts, function(error) {
    if (error) console.log("urmom");
  });
  //for loop that prints out every object in comports
  for (let i = 0; i < comPorts.length; i++) {
    console.log(comPorts.path[i] + i);
  }
}

function updateMouseHelper(){
  console.log('Updating mouse');
  const beforePorts = storage.get('beforePorts', function(error) {
    if (error) throw error;
  });
  const afterPorts = storage.get('afterPorts', function(error) {
    if (error) throw error;
  });

  // Get the ports that were plugged in
  const pluggedInPorts = getNewlyPluggedInPorts(beforePorts, afterPorts);

  console.log(`Plugged in ports: ${pluggedInPorts}`);

  // If there are no plugged in ports, return
  if (pluggedInPorts.length === 0) {
    console.error('No new com ports plugged in');
    return;
  }

  // If there is more than one plugged in port console error and return
  if (pluggedInPorts.length > 1) {
    console.error('More than one com port plugged in');
    return;
  }

  // If there is only one plugged in port, update the mouse

  if (pluggedInPorts.length === 1) {
    const port = pluggedInPorts[0];
    const firmwareVersion = localStorage.getItem('firmwareVersion');
    console.log("started update process");
    let success = updateMouse(port, firmwareVersion);
    console.log("finished update process");
  }
  Console.log(success ? "success" : "failure");
  return success;
}


module.exports.saveComPorts = saveComPorts;
module.exports.updateMouseHelper = updateMouseHelper;