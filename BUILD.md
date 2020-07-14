# Build Guide

Phaser Editor 2D v3 is all based on web technologies. It has a server-side and an HTML5 client-side.

The server is a small, native program that serves the editor and project files and interacts with the Operating System.

The client is the bigger part and contains all the graphical user interface.

This repository contains all the client code. This means that you can modify it and build it.

The main two reasons you may find to build the client code are: you are contributing to the code or you want to try the in-development version.

([In this repo](https://github.com/PhaserEditor2D/PhaserEditor2D-v3-build-develop) we provide a script to perform the following steps automatically)

## 1) Download the source code

First, you have to clone this repo to get the source code (you need a [Git client](https://git-scm.com/) installed).

```
$ git clone https://github.com/PhaserEditor2D/PhaserEditor2D-v3.git
```

By default, the current branch is `master`. It shows the latest, public version of the editor. To try the latest in-development changes, you should switch to the `develop` branch:

```
$ git checkout develop
```

If you want to contribute your modifications, you should create a pull request against the `develop` branch.

## 2) Install dependencies

Dependencies are managed with [NPM](https://www.npmjs.com/), you have to install it first.

```
$ cd PhaserEditor2D-v3/source/editor
$ npm install

```

## 3) Run the build script

```
$ ./build.sh
```

It should run the TypeScript compiler (installed in the `node_modules`) to compile the client's source code.

## 4) Download the latest Phaser Editor 2D binaries

Ok, you have the code of the client, but you need the server. The server is closed so you need to download the full latest version of the Phaser Editor 2D binaries.

It is available in the [Phaser Editor 2D downloads page](https://phasereditor2d.com/downloads).

It is distributed as a ZIP file. Unzip it.

## 5) Run the server with the new client

Now you can run the server but configure a new client. Look in the binaries you downloaded, there is a `PhaserEditor2D` executable file. Run it this way:

```
$ ./PhaserEditor2D -editor /path/to/PhaserEditor2D-v3/source/editor
```

The `-editor` option configures a new location of the client code. So, you have to write the full path to the `source/editor` folder of the repository you cloned.

## 6) Open the browser and run the IDE

Open this address in a browser:

```
http://127.0.0.1:1959/editor
```

Please, use a modern and updated browser.

If you used a previous version of the editor, it would be highly recommendable that you clean the browser cache while you load the new code.

Check in the Developer Console of the browser the version of the IDE.

If you have any issues, please, open an issue in this repository or contact us at `developers@phasereditor2d.com`. 