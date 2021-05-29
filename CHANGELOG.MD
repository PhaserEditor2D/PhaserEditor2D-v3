# Change Log

## v3.14.0 - May 29, 2021

### Added

* Scene Editor: **Add Component** button opens a dialog. Components are grouped by the container file.
* Scene Editor: adds the Settings option in the Scene menu of the context menu.
* Asset Pack Editor: adds the Blocks property section. It shows an option for displaying all files in the Blocks view.
* Asset Pack Editor: shows a Settings option in the context menu.
* Scene Editor: when enable a tool (like the Scale Tool), it asks for unlocking the scale properties of the selected objects. This applies to Rotate Tool, Scale Tool, Origin Tool, and Size Tool.

### Updated

* Viewer: optimize internal structure with paint information. Rendering is now way faster.
* Viewer: auto-hide scrollbar.
* Main menu: shows Unofficial Phaser Help Center option.

### Fixed

* Fixed null-pointer on context menu item with no bitmap icon.
* Viewer: fixes scrolls when all sections are collapsed.
* Asset Pack Editor: Add Asset dialog shows all files if the flag is enabled.
* Fixed Get License button from the Unlock Dialog.
* Asset Key property: fixes rendering of animations in the selection dialog.
* Scene Editor: method `removeFromDisplayList()` and `removeFromUpdateList()` is not present in `Phaser.GameObjects.Layer`. Skip it.
* Scene Editor: fixes copy/paste layer objects.
* Scene compiler: fixes "components-awake" event emitting of prefab's children.
* Scene compiler: fixes asset pack file url when a `publicroot` file is present.
* Inspector: fixed the many images viewer.
* [#89](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/89) Scene Editor: remembers last selected objects when opens.
* Menu: items show the negative icon on mouse hover.
* Menu: fixes positioning on buttons and similar elements.
* Menu: fixes color of "checked" icon on mouse hover.

## v3.13.0 - Apr 2, 2021

### Added

* Code editor: enables ES modules (exportClass, autoImport settings and code generation).
* The new "public root" concept. You can configure different public folders inside the project. Now an url of a pack file is computed based on the public root containing the pack file.
* Files view: highlights "publicroot" files and the container folder.
* User components: options button for the component's **Game Object Type** & **Super Class** fields.
* User components: the new `UserComponent.(js|ts)` class generator.
* Webpack project templates for JavaScript and TypeScript.
* Parcel project templates for JavaScript and TypeScript.

### Updated

* Update to Phaser v3.54.0.
* Inspector view: improves style of color buttons in Dark theme.
* Code generator: always use class fields. Init all fields in the declaration. Init in constructor is not used anymore.
* Default User Components File has the `Behaviors.components` name.
* Replace Type dialog: groups built-in types in sections: Texture, String, Shapes...
* By default, a new scene has `editorCreate()` as name of the "Create Method". The user code is generator calling `editorCreate()` within a handwritten `create()` method.
* User Component compiler: fixes TypeScript error when `strict` mode is enabled.
* Organize New Project dialog. It shows new categories: **Basic**, **Game Demos**, **Parcel**, and **Webpack**.
* Updated the basic project templates with a similar behavior to the webpack and parcel templates.

## v3.12.0 - Mar 12, 2021

### Added

* View: the tab sections are collapsible.
* Go To Scene dialog: scene files are grouped by the Phaser type.
* Scene Editor Blocks: when Prefabs tab-section is selected, the prefabs are grouped by Phaser type.
* Files view: the Design and Assets section.

### Updated

* Get latest Phaser v3.53.1.
* Viewer: improves cell renderer. It is always square by default.
* Assets Viewer: improves BitmapFont cell renderer.
* Set dark theme by default.

### Fixes

* Asset Pack Editor: fixes duplicate context menu.
* Scene Editor: panning with Alt key is selecting object under cursor. Fixed.
* Blocks view sections: collapsing sections changes the tab's label height. Fixed.

## v3.11.0 - Mar 5, 2021

### Added

* Scene Editor: command `V` toggles the visibility of the selected objects.
* Scene Editor: non-visible objects are shown with a "hidden" suffix in the Outline view labels.
* Scene Editor: the Change Texture dialog groups the items by type.
* Scene Editor: support SVG assets in the Blocks view.
* Scene Editor: show option to open an object's texture in the Asset Pack Editor.
* Scene Editor: allows changing texture's frame of an object (`M`).
* [#90](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/90) Scene Editor: shows the Add Object sub-menu in the context menu.
* [#90](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/90) Scene Editor: shows the Add Object dialog. You can open it with the `A` shortcut.
* Scene Editor: allows panning the scene by pressing `Alt+MouseLeftButton`.
* [#105](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/105) Scene Editor: the Select Texture dialog allows grouping the assets by type, asset pack, or location.
* Adds key-binding (`Ctrl+Alt+E`) for the command to open the output file in the configured external editor. This command is available in the Scene Editor and the User Components Editor.
* Scene Editor: new command to open a scene file (`Ctrl+Alt+O`).
* Scene Editor: Blocks content filtering via view's tab-sections.
* Asset Pack Editor: allows setting the scale of the SVG assets.
* Animations Editor: allows grouping the blocks by type, pack, and location.
* Viewer: advanced filtering by default. Allows matching different words.
* Viewer: filtering isn't triggered at every key.
* [#103](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/103): Close editor's tab with the mouse middle button.
* Allows adding the selected object to a new object list.
* Asset Pack Editor: Blocks are grouped by folder.
* [#109](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/109): Double click a folder to expand.
* Viewer: default context menu and three dots button.

### Fixed

* Scene Editor: Change Texture dialog allows selecting a texture with double-click.
* Scene Editor: `Text.lineSpacing` is ignored in code generation when it has the default value (`0`).
* Scene Editor: keep same origin when change the texture.
* Scene Editor: uses `Array<any>` as type for an empty ObjectList.
* Scene Editor: fixes code generation of the Text's `lineSpacing` property.
* Scene Editor: fixes change texture command. D*oesn't apply to non-texture objects. Fixes when selecting a new image (instead of atlas frame).
* Viewer: fixes Collapse All command, when the viewer is scrolled.
* Viewer: fixes Collapse/Expand branch command, when the viewer is scrolled.
* [#112](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/112) Asset Pack: skipping frames from spritesheets.

## v3.10.2 - Jan 17, 2021

* Scene Editor: Improve error handling when creating an object from JSON data.
* Scene Editor: Fixes scene creation when a BitmapText font key is not found.
* Files view: fixes bug on opening the context menu for files without an registered editor.
* Go To File dialog shows the file path.
* Commands dialog: highlights the keys.
* [#99](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/99) Scene Editor: string user property allows multi-line text.
* Update to Phaser 3.52.0.

## v3.10.1 - January 7, 2021

### Updated

* Theme restoring is managed by the colibri platform. This is not backward-compatible, your saved theme id will be ignored the first time you run this version of the editor.
* Moved `phasereditor2d.inspector` plugin to `colibri.inspector`.
* Get Phaser v3.51.0.

## v3.10.0 - Dec 22, 2020

### Added

* Scene Editor: support for all tilemap orientation.
* Scene Editor: Bitmap Text shadow properties.
* Scene Editor: Layer object.

### Updated

* Adopt Phaser v3.50.
* Scene Editor: uses WEBGL for scene's thumbnail generation.
* Scene Editor: set origin commands now uses Ctrl+Numpad instead Shift+Numpad.
* Project templates:
    * Migrated Sunny Land template to Phaser v3.50.
* When running the server in `-dev` mode, don't use Monaco editor dev files. This fixes the `-dev` option when it's used along.

### Fixed

* Editor tab context menu misspelling "Close to the right Right".
* Scene Editor: validates a tilemap's tileset doesn't have an external source.
* Scene Editor: catches error when accessing localforage for storing the thumbnail image.

## Version 3.9.2 - Dec 7, 2020

* Viewer: massive improvement of rendering performance.
* Viewer: fixes layout request in filtered viewers.
* Viewer-based dialogs: allows open an item with the Enter key.
* Scene Editor: caches scene file thumbnails in local browser Indexed DB. 
* Scene Editor: more accuracy on thumbnail generation of container-based prefabs.
* Restore custom "alert" message dialog.

## Version 3.9.1 - Nov 30, 2020

* Check if a new version is available at startup.
* *Check For Updates* is a new option in the main menu. It shows a message if there is a new version.

## Version 3.9.0 - Nov 24, 2020

### Added

* Scene Editor: supports new Shape objects:
    * Rectangle.
    * Ellipse.
    * Triangle.
* Scene Editor: the Tilemap Layer Outline cell renderer draws the layer.
* Scene Editor: group built-in types by category, in the Blocks view.
* Electron:
    * Allows changing the workspace.
* A main menu option to unlock the editor, when it runs in application mode.
* Shows license activation status in title bar and About dialog.

### Modified

* The **Resize TileSprite Tool** was renamed to **Resize Tool**. It also allows resize shape objects. 

### Fixed

* Fixes regression sorting atlas frames in viewers.

## Version 3.8.1 - Nov 1, 2020

### Fixed

* Fixes atlas thumbnail generation when atlas URL is pointing to a missing file.

## Version 3.8.0 - Oct 30, 2020

### Added

* User property: Texture Config type shows the texture as the search-button icon.
* User property: Animation Key type shows the middle frame as the search-button icon.
* User property: Asset Key (and derived) properties reveal current value when the search dialog is open.
* Blocks view of Scene Editor shows built-in type blocks, ready to be dropped into the scene.
* Files view: Open a file with the default editor if no other editor is available for it.
* Files view: shows the Open With option in the context menu.
* Remember the editor type when open a file at startup.
* User components editor: complete the Compiler menu in the context menu. With commands to open the output file.
* User components editor: shows the context menu in the Outline view.
* Scene Editor: allows writing an expression in property fields.
* New Sunny Land project template, based on Tiled maps.
* Scene Editor:Tilemap, StaticTilemapLayer and DynamicTilemapLayer support.

### Removed

* Removed the Add Object dialog. Instead, you should use the Blocks view.
* Removed old Dark theme. Renamed Dark Plus theme to Dark.

### Modified

* Improves performance of the viewer cell renderers of atlas assets.
* Improves some colors in the blue theme: scene editor, buttons and toolbar items.
* Allows add more files to the Upload dialog.
* Scene Editor: groups the compiler commands in the compiler section of the context menu.
* Scene Editor: improves performance of the Inspector view updating when transforming an object.

### Fixes

* Fixed the clicking-area of the titles in the Inspector sections.
* Fixes `Ctrl+S` when the Quick Edit Dialog is active.
* Scene Editor: uses spritesheet name on objects created with a spritesheet frame.
* Scene Editor: show a message when you open the Quick Editor dialog but no output file is generated yet.
* Scene Editor: fixes layout of image preview in the Texture section of the Inspector view.
* Scene Editor: fixes picking of flipped objects.
* Viewer: fixed filtering, now it does not expand mismatching parent items.
* JavaScript editor: fixes the file-rename operation handling.

## Version 3.7.1 - Sep 22, 2020

### Fixes

* Animations Editor: fixes display and serialization of animations based on simple image files.

## Version 3.7.0 - Sep 19, 2020

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
