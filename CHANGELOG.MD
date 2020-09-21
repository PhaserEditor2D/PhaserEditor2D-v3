# Change Log

## Version 3.7.0 - September 19

### Modified

* User property: Texture Config type shows the texture as the search-button icon.

### Added

* Scene Editor: add more user property types:
    * Texture Config
    * Animation Key
    * Audio Key.
    * Asset Key
* Scene Editor: allows change type of the selected objects in the Variable section.
* Scene Editor: allows change type of user properties.
* Asset Pack Editor: adds support of the Scripts asset type. To load multiple scripts in a predictable order.

### Modified

* Some icons updated.
* The Delete command is mapped to the `Backspace` key (in addition to the `Delete` one). It is more friendly for macOS users.

### Fixed

* Viewer: ignore mouse-up event if it was originated outside the viewer.
* Assets: increase the limit of spritesheet frames to 1000.
* Animations Editor: handles asset missing errors.
* Scene Editor: does not sort the content of the Add Object dialog.
* Keys: in macOS, the `Command` and `Ctrl` keys are handled as the same key.
* Code editor: when is active, the `Ctrl+P` keys open the Go To File dialog, and not the printing dialog.
* Fixed: Scene Editor captures the key commands even if a dialog is open.

## Version 3.6.0 Sep 7, 2020

### Added

* The Animations Editor.

### Fixed

* [#71](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/71) Files view: fixes files sorting. Folders go first.
* Viewer: scrolling when distant elements are selected.
* Scene Editor: better scene thumbnail generation.
* Viewers in Inspector view: removes the lag when updating the viewer size with its parent.

### Modified

* Viewers: Pads with `0` chars the labels of spritesheet frames. It helps with sorting: `001`, `002`,...,`126`.

## Version 3.5.0 Aug 19, 2020

### Added

* Scene Editor: shows error dialog when multiple files share the same scene id.
* [#63](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/63) Scene Editor: the **Fix Duplicated Scenes ID** command assign new IDs to the newer scene files.
* Scene Editor: the **Duplicate Scene File** command, available in Scene Editor > context menu > Scene.
* [#65](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/65) Scene Editor: the **Insert Spaces** and **Tab Size** parameters. To convert tabs to spaces in the compiler output.
* Scene Editor: the new created scenes will get the following parameters value from the latest modified scene: **compilerOutputLanguage**,**compilerInsertSpaces**, **compilerTabSize**, **borderWidth**, **borderHeight**, **borderX**, **borderY**.
* SceneEditor: the Pan scene tool.
* Scene Editor: allows move up/down the user components.
* User Components Editor: the **Insert Spaces** and **Tab Size** parameters.
* Saves the zooming state of all viewers in views, editors, dialogs, etc...
* [#59](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/59) Option to exclude a directory from the project.

### Modified

* [#61](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/61) Alphabetic sorting of viewer content.
* [#47](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/47) Inspector view: clearing content of a number field resets it to the default value.

### Fixes

* Scene Editor: fixes serialization of user number properties with `null` as default value.
* Scene Editor: fixes ID generation when pasting container objects.
* [#62](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/63) Scene Editor: fixes prefab constructor code generation when the texture is empty.

## Version 3.4.0 - Aug 4, 2020

### Added

* User Component Editor.
* Scene Editor: in Prefab Instance section shows a menu next to each prefab, to select all prefab instances.
* Scene Editor: adds user property of boolean type.
* Scene Editor: added a Compile Project command. It compiles all compilable files of the project (scenes, components).
* Volcano project template.

### Removed

* **User Init Method** parameter and **Compiler Prefab Settings** section. Now you can insert code directly in the constructor of the prefab.
* Show size info of images, atlas frames and spritesheet frames in the Inspector view.
* Scene Editor: the Texture section shows the image size.
* Scene Editor: removed the Compile Scenes command. The Compile Project command compiles all files including the scenes.
* Flying Dragon project template.

### Modified

* Scene Editor: Object Lists are created first as temporal variables, and, if the scope is CLASS or PUBLIC, a field is generated.
* Scene Editor: in prefab scenes, the Outline view displays the non-prefab objects with transparency.
* Scene Editor: in prefab scenes, when the prefab object is selected, the Variable section is not shown in the Inspector view.
* Scene Editor: a new object is added to a container if the container is selected or a child of it.
* Scene Editor: in prefab scenes, when add an object it is added to the root object if it is a container, else, a new container is created, to wrap the root object and the newly added.
* Inspector view: use rounded background for title and sub-titles of the sections.

### Fixed

* Scene Editor: fixes command to create a prefab with the selected object. The new prefab is positioned at `0,0`.
* Scene Editor: fixes scene thumbnail generator when the scene is a prefab with a container that wraps an object.

## Version 3.3.1 - July 15, 2020

### Added

* Phaser 3.24.1 support.

### Fixed

* [#52](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/52) Moving objects with arrow keys is not updating the properties in the Inspector view.
* [#54](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/54) Asset Pack Editor: fixes delete items with context menu Delete option.
* Fixes Asset Pack file selection dialog in **Compiler Scene Settings**.
* FileEditor clears undo history when a file is modified in an external editor.

### Version 3.3.0 - July 1, 2020.

### Added

* Asset Pack: allows to import SVG files as HTML Image.
* Asset Pack: adds an Open button to the File Key section.
* Asset Pack: shows a Help link in the menu of the Inspector sections.
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
* Scene Editor: automatic creation of root container in a prefab scene.
* Scene Editor: in a prefab scene, non-prefab objects are renderer with transparency.
* [#41](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/41) Scene Editor: zoom in/out buttons.


### Modified

* Improved Asset Pack File section in Inspector view.
* [#44](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/44) Workbench: does not validate if there is an `index.html` file in the root folder.

### Fixed

* Fixes menu vertical positioning when there is few space at the top.
* Scene Editor: shows message when a prefab is not found.
* Scene Editor: fixes user property declaration when no initial value is provided.
* [#59](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/59) Scene Editor: compiler skips using field declarations in JavaScript output. It is not supported in Safari.
* Scene Editor: fixes scene compiler code merging when the output file was modified by formatters that replace tab chars with spaces.
* Scene Editor: fixes mouse wheel click on Safari.

## Version 3.2.0 - June 14, 2020

### Added

* [#32](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/32) In-App update. With `PhaserEditor2D -update` the server downloads the latest version and replace the old files with the new files. With `PhaserEditor2D -download`, the server downloads the latest version zip, and you can install it manually.
* Prefab user properties. You can add user properties to prefabs and change the values in the prefab instances.
* Scene Editor: create a prefab file with the selected object.
* Scene Editor: new command (with key `Q`) to open a Quick Editor Dialog to edit the compiler output file.
* Scene Editor: open compiler output file in VS Code. Enabled when the IDE runs in Desktop mode.
* Scene Editor: the Replace Type dialog provides the option "Keep the original texture", used when you are morphing an object to a prefab type.
* Scene Editor: removes extra blank lines in generated code.
* Open Visual Studio Code command in main menu. Bound to the `Ctrl+Alt+U` key.
* A Comment Dialog (`Ctrl+Alt+Space`), to write messages in presentations or video-recording.

### Modified

* Files view: the context menu **New** option does not open the **New File** dialog. Now it is a sub-menu with the shortcuts to create a new file of any supported content type.
* Scene Editor: the translate and rotate manipulators set integer values to objects.
* Scene Editor: in a prefab scene, the non-prefab objects are rendered with transparency, in the Outline view.
* Scene Editor: in a prefab scene, does not show the Inspector view's Variable and Lists sections if the selected object is the prefab object.
* Scene Editor: auto creates a container when add new objects to a prefab scene.
* Scene Editor: removes redundant `sceneType` attribute in scene file serialization.

### Fixed

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
