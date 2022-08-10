# Kuromi's Finalware

This project contains a firmware update tool for Starlight-12 mice written in
JavaScript using Electron for the Frontend and is based on the
[Serial Port](https://serialport.io) library to communicate with the hardware. And the official 
Nordicsemiconductor library for flashing Firmware, [pc-nrf-dfu-js](https://github.com/NordicSemiconductor/pc-nrf-dfu-js)

## Installation

In order to install this tool, all you need to do is check out our
[releases page](https://github.com/Kuromis-2/finalware/releases) and
download the version of the program you need!

## Build Instructions
### 1. Clone the repository.
```bash
git clone git@github.com:Kuromis-2/finalware
```
### 2. Prerequisites\
Download the [Node Installer](https://nodejs.org/download/release/v16.15.0/node-v16.15.0-x64.msi) and go trough the installation process.
After that install yarn.
```bash
npm install --global yarn
```
You'll also need wix to build msi installers. Just download the installer from [here](https://wixtoolset.org/releases/)

To build for windows you'll need Visual Studio and the Windows SDK. I just recommend the latest Version of [Visual Studio](https://visualstudio.microsoft.com/de/?utm_source=developermscom) and the latest [SDK](https://developer.microsoft.com/de-de/windows/downloads/windows-sdk/). 
### 2. Node modules\
Make sure you have node installed, we used v16.15.0 but any modern version should work. 
Install the node modules by using pnpm.
```bash
pnpm install
```
### 3. Build
