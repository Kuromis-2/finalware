# Finalware

This project contains a firmware update tool for Starlight-12 mice written in
JavaScript using Electron for the Frontend and is based on the
[Serial Port](https://serialport.io) library to communicate with the hardware. And the official 
Nordicsemiconductor library for flashing Firmware, [pc-nrf-dfu-js](https://github.com/NordicSemiconductor/pc-nrf-dfu-js)
Even tho we use the finalmouse logo in our tool to clarify the usecase, this tool is UNOFFICIAL.
At the Moment the software relies on capturing the com ports first, prompting the user to plug in their mouse and capturing the com ports again. The newly added com port is the one of the mouse. 
To make it easier and less prone to errors we changed to getting the mouse by the Vendor and Product ID. The changes are only on the [dev branch](https://github.com/Kuromis-2/finalware/tree/dev) right now. But the latest Release for Windows already has these changes.

## Showcase
![Gif](https://raw.githubusercontent.com/Kuromis-2/finalware/main/finalware.gif)

## Support 
We currently support Intel Macs, Windows and Linux.

## Installation
### Windows
On Windows we got a msi oneclick installer, its the most user friendly experience out of the 3 supported platforms.
### Linux
We provide a .deb package for debian based system aswell as a zip file with a binary file. Besides that you currently have to change ur user permissions to access COM Ports. We have an explaination of how to do this in the known issues section
### MacOS
We provide a dmg installation.

## [Build Instructions](https://github.com/Kuromis-2/finalware/blob/main/buildinstructions.md)

## Known Issues
### Not able to access COM-Ports on linux
The default user permissions on linux prevent our application to access the USB-Ports, to fix this you can change the permissions with the following command. ```sudo adduser $USER dialout```
### Icon not working when installed per .deb package



