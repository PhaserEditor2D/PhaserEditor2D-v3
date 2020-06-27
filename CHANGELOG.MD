# Change Log

## Version 3.2.0-next

## Added

* Asset Pack Editor: allows to import SVG files as HTML Image.
* Closes a couple of Input dialogs (New File, New Project, Rename File) when press ENTER in the input field.
* **Go To File** command `Ctrl+P`.
* Viewer dialog selects visible (or selected) item with the ENTER key.
* Filtered Viewer: allows pressing the Up/Down keys to focus the filter text or the viewer.
* Filtered Viewer: shows zoom buttons.
* Upload dialog: allows to drop files.
* Scene Editor: the Select Region tool.
* Scene Editor: scale proportionally if the `Shift` key is pressed when using the Scale tool.
* Scene Editor: arrow keys commands to change the position of the objects. Press `Shift` for 10x. It respects snap values.
* Scene Editor: enables copy/paste objects across scenes.
* Scene Editor: Inspector view sections show a menu with a Help item and related commands.
* Asset Pack: adds an Open button to the File Key section.
* Asset Pack: shows a Help link in the menu of the Inspector sections.

## Modified

* Improved Asset Pack File section in Inspector view.

## Fixed

* Fixes menu vertical positioning when there is few space at the top.
* Scene Editor: shows message when a prefab is not found.
* Scene Editor: fixes user property declaration when no initial value is provided.
* [#45](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/45) Scene Editor: compiler skips using field declarations in JavaScript output. It is not supported in Safari.

## Version 3.2.0 - June 14, 2020

## Added

* [#32](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/32) In-App update. With `PhaserEditor2D -update` the server downloads the latest version and replace the old files with the new files. With `PhaserEditor2D -download`, the server downloads the latest version zip, and you can install it manually.
* Prefab user properties. You can add user properties to prefabs and change the values in the prefab instances.
* Scene Editor: create a prefab file with the selected object.
* Scene Editor: new command (with key `Q`) to open a Quick Editor Dialog to edit the compiler output file.
* Scene Editor: open compiler output file in VS Code. Enabled when the IDE runs in Desktop mode.
* Scene Editor: the Replace Type dialog provides the option "Keep the original texture", used when you are morphing an object to a prefab type.
* Scene Editor: removes extra blank lines in generated code.
* Open Visual Studio Code command in main menu. Bound to the `Ctrl+Alt+U` key.
* A Comment Dialog (`Ctrl+Alt+Space`), to write messages in presentations or video-recording.

## Modified

* Files view: the context menu **New** option does not open the **New File** dialog. Now it is a sub-menu with the shortcuts to create a new file of any supported content type.
* Scene Editor: the translate and rotate manipulators set integer values to objects.

## Fixed

* Don't activate the editor when clicking on the close button.
* Image Editor: registers the right content type association.
* Monaco editor: on a model change, if the model content is the same of the file content then the editor is not marked as dirty (unsaved).
* Scene Editor: fixes the type inference of an empty Object List.
* Pre-load content type of uploaded files.

## Version 3.1.1 - May 25, 2020

### Fixed

* [#33](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/33) Wrong BitmapText default origin.
* [#32](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/32) The server checks if there is a new version available. 
* Monaco (code) editor updates content with external changes only if the flag `-enable-advanced-js-editor` is set. Now it updates always.
* [#37](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/37) TypeScript project template opens the README file the first time, with the instructions to run the project. 
* Scene Editor: does not compile a scene if the output file is open in a dirty (unsaved) editor.

## Version 3.1.0 - May 24, 2020

### Added

* Scene Editor: use a color picker for the color properties in the Inspector view.
* Scene Editor: the origin manipulator. To select it press `O` or select it in the context menu or toolbar. It also support containers.
* Scene Editor: the Tint properties.
* Scene Editor: two scopes for transformations: local and global. You can select it in the context menu (Coords -> Global). Default is local.
* Server: shows helpful welcome messages.
* Persist the collapsing state of the Inspector view sections.

### Removed

* The TypeScript template does not include the compiler output files (`game.js`). The user should compile the project before play it.

### Modified

* Scene Editor: the **Set Origin To** commands modify the origin of the object but keep it's global position.
* Replace usage of EventTarget with a custom event emitter.

### Fixed

* Scene Editor: fixes the Translate manipulator when the objects are children of a transformed container.
* Deep nested menus are closed well.
* Sub-menus do not overlap with the parent menu.
* [#26](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/26): File upload in Windows.
* Scene Editor: fixes picking of a container prefab instance.
* Scene Editor: fixes the Parent dialog in the Parent properties section. Now it does not show container prefab instances.

### Compatibility

* Safari browser: EventTarget is not supported as constructor. We replaced it by a custom event emitter (colibri.ui.controls.ListenerList).

## Version 3.0.1 - May 16, 2020

### Bug fixes

* [#15](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/15): Blurry text in HiDPI screens.
* Scene Editor: improves picking of objects.
* SceneEditor: improves Outline view rendering of BitmapText objects.
* Inspector view: hides overflow text in the sections title.

## Version 3.0.0 - May 5, 2020

[First public release](https://phasereditor2d.com/blog/2020/05/phaser-editor-v3-released-for-the-public-new-online-service-play-phaser-editor-2d)