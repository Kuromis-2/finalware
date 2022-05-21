# Finalware

## Introduction
A simple walktrough Firmware Updater for your Starlight-12 mouse. Cross-Platform, User Friendly and built on electron.

## Support 
We currently support Intel Macs, Windows and Linux.

## Installation
### Windows
On Windows we got a msi oneclick installer, its the most user friendly experience out of the 3 supported platforms.
### Linux
We provide a .deb package for debian based system aswell as a zip file with a binary file. Besides that you currently have to change ur user permissions to access COM Ports. We have an explaination of how to do this in the known issues section
### MacOS
We provide a .zip app package.

## Known Issues
### Not able to access COM-Ports on linux
The default user permissions on linux prevent our application to access the USB-Ports, to fix this you can change the permissions with the following command. ```sudo adduser $USER dialout```
### Icon not working when installed per .deb package

