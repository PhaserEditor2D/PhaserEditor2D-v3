# Phaser 3 + Phaser Editor 2D + Parcel Template

> For people who want to spend time making games instead of configuring build tools.

## Author

This template is a fork of the [Ourcade's Parcel Template for Phaser 3](https://github.com/ourcade/phaser3-parcel-template). The Phaser Editor 2D team added a couple of files and configurations focused on the Phaser Editor 2D tools.

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/), and [Parcel](https://parceljs.org/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

Then install Parcel:

```bash
npm install -g parcel-bundler
```

## Getting Started

Go into your new project folder and install dependencies:

```bash
npm install
```

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Class Properties Support

This template includes class property support out of the box using `@babel/plugin-proposal-class-properties`.

A `.babelrc` is included as well as the use of `babel-eslint` as the parser for ESLint.

# ESLint

This template uses a basic `eslint` set up for code linting to help you find and fix common problems in your JavaScript code.

It does not aim to be opinionated.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

## Dev Server Port

You can change the dev server's port number by modifying the `start` script in `package.json`. We use Parcel's `-p` option to specify the port number.

The script looks like this:

```
parcel src/index.html -p 8000
```

Change 8000 to whatever you want.

## Other Notes

[parcel-plugin-clean-easy](https://github.com/lifuzhao100/parcel-plugin-clean-easy) is used to ensure only the latest files are in the `dist` folder. You can modify this behavior by changing `parcelCleanPaths` in `package.json`.

[parcel-plugin-static-files](https://github.com/elwin013/parcel-plugin-static-files-copy#readme) is used to copy static files from `public` into the output directory and serve it. You can add additional paths by modifying `staticFiles` in `package.json`.

## Phaser Editor 2D notes

We did minor changes to this repo for making it more friendly with Phaser Editor 2D.

### Excluding files from the project

There are a lot of files present in the project that are not relevant to Phaser Editor 2D. For example, the whole `node_modules` folder should be excluded from the editor's project.

The `/.skip` file lists the folders and files to exclude from the editor's project. 

[Learn more about resource filtering in Phaser Editor 2D](https://help.phasereditor2d.com/v3/misc/resources-filtering.html)

### Setting the root folder for the game's assets

The `/public` folder contains the assets (images, audio, atlases) used by the game. Parcel copies it to the distribution folder and makes it available as a root path. For example, `http://127.0.0.1:8000/assets` points to the `/public/assets` folder.

By default, Phaser Editor 2D uses the project's root as the start path for the assets. You can change it by creating an empty `publicroot` file. That is the case of the `/public/publicroot` file, which allows adding files to the Asset Pack file (`/static/assets/asset-pack.json`) using correct URLs.

### Coding

The `/src` folder contains all the JavaScript code, including the scene and user component files, in addition to the Phaser Editor 2D compilers output.

We recommend using Visual Studio Code for editing the code files.

In many tutorials about Phaser Editor 2D, the JavaScript files are loaded using the Asset Pack editor. When using Parcel this is not needed. Just use the Asset Pack editor for loading the art assets.

### Scene and User Components configuration

The Scenes and User Components are configured to compile to JavaScript ES modules. Also, the compilers auto-import the classes used in the generated code.

## License

[MIT License](https://github.com/ourcade/phaser3-parcel-template/blob/master/LICENSE)
