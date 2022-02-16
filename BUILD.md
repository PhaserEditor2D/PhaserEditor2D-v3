# Build Guide

Phaser Editor 2D v3 is all based on web technologies. It has a server-side and an HTML5 client-side.

The server is a small, native program that serves the editor and project files and interacts with the Operating System.

The client is the bigger part and contains all the graphical user interface.

This repository contains all the client code. This means that you can modify it and build it.

The main two reasons you may find to build the client code are: 

* You are contributing to the code.
* You want to try the in-development version.


## 1) Download the source code

First, you have to clone this repo to get the source code:

```
$ git clone https://github.com/PhaserEditor2D/PhaserEditor2D-v3.git
```

By default, the current branch is `master`. It shows the latest, public version of the editor. To try the latest in-development changes, you should switch to the `develop` branch:

```
$ cd PhaserEditor2D-v3/source/editor
$ git checkout develop
```

If you want to contribute your modifications, you should create a pull request against the `develop` branch.

## 2) Install dependencies

Dependencies are managed with [NPM](https://www.npmjs.com/), you have to install it first:

```
$ npm install

```

## 3) Run the build script

```
$ npm run build
```

It should run the TypeScript compiler (installed in the `node_modules`) to compile the client's source code.
If you want to build the project each time you modify a file, you can run the `watch` script:

```
$ npm start
```
 
## 4) Run the server with the new client

Phaser Editor 2D Core allows running the server with a different client. It is what you need to do here, to run the latest stable server but loading this client:

```
$ npx phasereditor2d-launcher -editor . -dev -disable-plugins phasereditor2d.code -project path/to/game
```

The [phasereditor2d-launcher](https://www.npmjs.com/package/phasereditor2d-launcher) is a cli-based node module. It launches the latest version of Phaser Editor 2D Core.

The `-editor` option configures a new location of the client code.

The `-dev` option disables the browser cache, so it always fetches a fresh version of the files.  **Note:** You will also need to manually disable your browser cache in your browser's Developer Tools.

The `-disable-plugins` option disables the [Advanced Javascript Editor](https://help.phasereditor2d.com/v3/code-editor/index.html), which is used in Phaser Editor 2D All-in-One but not in Core.

The `-project` flag indicates the path to the game project. It is mandatory.

## 5) Open the browser and run the IDE

Open this address in a browser:

```
http://127.0.0.1:1959/editor
```

Please, use a modern and updated browser.

If you used a previous version of the editor, be sure to clear your browser cache in your browser's Developer Tools before loading the new code.

If you have any issues, please, open an issue in this repository or contact us at `developers@phasereditor2d.com`. 