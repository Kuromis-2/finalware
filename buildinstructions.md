## Build Instructions
### 1. Clone the repository.
```bash
git clone git@github.com:Kuromis-2/finalware
```
### 2. Prerequisites
Download the [Node Installer](https://nodejs.org/download/release/v16.15.0/node-v16.15.0-x64.msi) and go trough the installation process.
After that install yarn.
```bash
npm install --global yarn
```
You'll also need wix to build msi installers. Just download the installer from [here](https://wixtoolset.org/releases/)

To build for windows you'll need Visual Studio and the Windows SDK. I just recommend the latest Version of [Visual Studio](https://visualstudio.microsoft.com/de/?utm_source=developermscom) and the latest [SDK](https://developer.microsoft.com/de-de/windows/downloads/windows-sdk/). 
### 2. Node modules
Make sure you have node installed, we used v16.15.0 but any modern version should work. 
Install the node modules by using yarn.
```bash
yarn
```
### 3. Build
Run electron-forge with the following command.
```bash
yarn make
```
You may get this Error:
```
error MSB8036: The Windows SDK version 10.0.22621.0 was not found. Install the required version of Windows SDK or change the SDK version in the project
```
A possible fix is to open ``node_modules\@serialport\bindings\build\bindings.vcxproj`` and change the WindowsTargetPlatformVersion to the Version of your installed SDK.
### 4. Adding new Build Targets
To add new build targets, add ur target to the maker Object in the package.json. You can find the documentation [here](https://www.electronforge.io/config/makers)
