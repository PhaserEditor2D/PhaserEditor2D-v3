# Change Log

## v3.67.0, Feb 22

* Updates to latest TypeScript 5.3.3.
* Updates to latest CodeMirror 5.66.16.
* Adds support to Phaser 3.80.
* Save all editors when the user executes the Play commands.
* Depth order commands now works with Mac keyboard with a numeric pad, in its default config.
* Fixes bug with opening multiple context menus.
* Color Picker shows realtime preview of the color.
* Allows changing numeric values with the mouse wheel.
* Allows changing numeric values with the Up/Down keys. If Shift is pressed, it increments it by 10.
* Allows changing numeric values by dragging the label.
* Adds support to Shader Effects objects, Glow and Shadow.
* Uses the Text's internal canvas to render the Text object in the Outline view.
* Use the __MISSING texture by default in NineSlice and ThreeSlice.

## v3.66.0 - Jan 11, 2024

* Allows to set a display name to game objects.
* The display name formatting expression #{x} expands to "x".
* The display name formatting shows prepends the `TargetActionComp.target` value, if present.
* Fixes name collision when copying a game objects tree.
* Fixes duplicating children objects on a tree copy/paste.
* Fixes getting user components of nested prefabs.
* Allows user component object formatting.
* Allow read-only editors.
* Set read-only to editors of node_module files.

## v3.65.0 - Dec 13, 2024

* Allows using prefabs and user components from node modules.
* Allows tagging folders as "copied" libraries, with the `library.txt` file.
* Adds onWorldBounds property to the Arcade Physics Body.
* The Add Script Node dialog groups scripts by folder and node modules.
* The Blocks view groups the scripts by folder and node modules.
* Allows custom display format of prefab instances, using ${} and #{} expressions.
* Shows tooltip with prefab property info.
* Allows setting a Scene Display Name for scenes.
* Allows setting the Display Name of user components.
* Migrates all project templates to the new script libraries.

## v3.64.0 - Nov 10, 2023

* Fixes making thumbnails of single-layer prefabs.
* Allows merging Import and Open buttons in the Asset Pack Entry section.
* [#251](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/251) Fixes sprite positioning in Animations Editor.
* [#209](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/209) Improves scene border painting.
* Improves animations preview UI:
    - New Animation preview section.
    - New Animations Preview section.
    - Shows a preview button in the Animation Key user property.
* Adds new Animation section to Sprite game objects. It is about to auto-start a sprite animation.
* Adds `showBeforeDelay` to the Animations Editor.
* Shows Sprite Animation blocks in the Scene Editor's Blocks view.
* Aseprite animations support.
* New Code Snippets scene elements.
* Optimizes pooling of WEBGL contexts.
* [#295](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/295) Fixes tilemapLayer nullable method factory.

## v3.63.0 - Sep 30, 2023

* Opens the file given in the `openfile` URL search parameter. Like in `?openfile=some/file`.
* Show splash before loading the workbench.
* Boost load speed: migrates editor's icons from single files to a texture atlas.
* Boost load speed: bundle all IDE text resources into a single res.json file.
* Improves browser cache managing. Loads way faster when running in the cloud.
* Shows property shortcuts in the prefab properties section.
* Shows Prefab Properties section also when a property is selected.
* Show event icons in the Event property's dialog.
* Allows downloading all v3 files from the Phaser Editor 2D website.
* [249](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/249) Auto compile the scene file when it is created.
* Adds support to Spine animations.
* Adds spine project template to marketplace.
* [#289](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/289) Fixes hit area computation on nested containers.

## v3.62.2, Jul 2, 2023

* Fixes exporting user components in prefabs.

## v3.62.1, Jun 30, 2023

* Fixes KeyCode user property editor.

## v3.62.0, Jun 29, 2023

* New Event user property.
* [#284](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/284) Fixes hit area rendering for containers.
* A new Add Prefab Property command that shows a dialog.
* Replaces the Object Depth commands for the Edit move commands.
* Replaces the Object List sort commands by the Editor move commands.
* Allows change prefab properties with the Edit move commands. Remove the Move options from the Prefab Properties section's menu.
* Allows copy/cut/paste of prefab properties.
* Allows copy/cut/paste keyboard keys.
* Shows Keyboard.Key and Object List objects in the Object Variable user property's dialog..
* Adds the new KeyCode User Property.
* Fixes hit area serialization.
* Removes the User Components section and shows user components properties as individual sections:
    * Renames the Scripts context menu to Scripting and include:
        - Add User Component (`M` key)
        - Browse User Components (`Shift+M` key)
* Removes user component nodes from the Outline view.
* Removes the Prefab Instance section, shows the prefab instance user properties as individual sections.
* The Replace Texture Frame command responds to the `F` key.
* Fixes adding a script node to all selected game objects.
[#223](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/222) Fixed tab-focus on the DOM elements of the user properties.

## v3.61.0 - May 18, 2023

* Checks if a scene file was generated by a newer and incompatible version of the editor.
* Shows Object List items in the Outline view. Allows ordering the items with the Up, Down, Top, Down, commands.
* A new game object scope: LOCAL. The LOCAL scope is now the default scope for objects and has the same meaning of METHOD scope before. Now the METHOD scope forces the creation of a variable for the object.
* Auto computes the middle-private nested prefabs. It doesn't require to declare a parent of a nested prefab as nested prefab. 
* Improves Outline elements tagging. It uses tahs like `#prefab_inst` `#nested_prefab_inst` `#scope_local` `#scope_nested_prefab`... So you can search for it in the Outline filter box.
* Allows enabling input in objects.
* Adds the Name parameter to the Variable section of a nested prefab instance.
* [#282](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/282) Use full nested prefab path in user object variable properties.
* Excludes script node prefabs from the Blocks view when editing a non-script node scene.

## v3.60.3 - Apr 27, 2023

* Fixes regression bug with the Play command.

## v3.60.2 - Apr 27, 2023

* Fixes creating a prefab layer with a selected container or layer.
* Updates the ScriptNode resources with the bug fixes.
* [#129](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/129) Adds Preview Scene command (Ctrl+0). It runs the game in the browser and passes the `start=<scene-name>` parameter.

## v3.60.1 - Apr 21, 2023

* Fixes plain object serialization (keyboard keys, colliders,...).

## v3.60.0 - Apr 16, 2023

* Fixes labels of the Size section in the Inspector view.
* Scene compiler: fixes class-field declaration.
* Scene compiler: fixes nested prefab varname resolution.
* Improves folder icons.
* Adds command for enable/disable pixel art rendering mode.
* New game objects support: NineSlice and ThreeSlice.
* Removes Parent section.
* Supports the new ScriptNode object.
* Updates the app icon.
* Updates to Phaser 3.60.
* Updates allInOne built-in templates to support Phaser 3.60 and script nodes.

## v3.36.2 - Dec 14, 2022

* Get latest update from Core: 
    * Fixes email notification with license keys generated by the License Manager.

## v3.36.1 - Dec 12, 2022

* Get latest changes from Core.

## v3.36.0 - Nov 15, 2022

* Animations Editor: allows creating an animation with a single frame.
* Animations Editor: allows compiling the animation keys as JavaScript/TypeScript constants.
* Scene Editor: adds Keyboard.Key object support.

## v3.35.2 - Nov 10, 2022

* Refactored migration process. Fixes running migrations when creating the scene thumbnails.
* Adds migration for `Text.align` property.
* Fixes bug when opening the Command Palette and no editor is open.
* Adds a **Migrate & Compile All Scenes** command.
* [#250](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/250): Fixes adding a physics body to a scaled object.

## v3.35.1 - Nov 3, 2022

* Removes extra collideWorldBounds parameter in Inspector section.
* Shows prefab properties as independent elements in the Outline view.
* User Components Editor: shows & edits properties as independent entities.
* Bug fix: doesn't keep user comonents in object when convert it to prefab.
* Fixes background for the "New update available" notification. If you click the notification panel, it opens the `https://phasereditor2d.com/downloads` page.
* Shows User Components as children nodes of the objects in the Outline view.
* A new Export parameter in the user components of prefab objects.

## v3.35.0 - Oct 14, 2022

* Allows append objects to a prefab instance.
* Fixes Users Components files serialization. The `app` field is `Phaser Editor 2D - User Components Editor`, and the `contentType` field is `phasereditor2d.core.scene.UserComponents`.
* Removes Monaco-based editors.
* Uses colors for XY labels in the Inspector view.
* Adds support for Arcade physics. The Arcade Image & Sprite. And the body tools.
* Adds APPLE_M1_README.txt file to All-in-One/macOS-arm dist.
* Fixes bug with Replace Type command: wrong unlocking position properties.

## v3.34.0 - Aug 12, 2022

* Fixes assets preloading when paste a layer/container prefab from another scene.
* Removes the `Key` and `Digit` prefixes from the label of commands.
* Scene Editor: fixes layout operations with scaled images.
* Scene Editor: improves layout toolbar. Adds origin actions.
* [#229](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/229) Fixes serialization of tilemap layers as children of containers and layers.
* [#227](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/227) Adds the Polygon shape game object.

## v3.33.2 - May 31, 2022

* Improves Size tool modifiers.
* Avoids caching of plugin resources.
* Scene Editor: skips refreshing the scene after the paste operation. Fixes object's loader extensions. 
* Exports Tint properties to plugins.
* Origin tool allows custom origin properties (like in in a NinePatchContainer).
* Improves support for third-party game object plugins.
* Adds Alpha component to the Container game object.
* Fixes layout commands for objects with custom origin.
* Fixes tilemap's field code generation.
* Fixes tilemap's layer selection in scene.

## v3.33.1 - May 10, 2022

* [#210](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/210) Missing Variable Pane. Removes everythign related to the Inspector view sections.
* [#212](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/212) The new Object Constructor user property type.
* [#216](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/216) No Textures are Available to Select from the Select Texture Window When Using Components.

## v3.33.0 - April 18, 2022

### Added

* [#195](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/195) The new GO Name parameter.
* [#144](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/144) Scene Editor: allows paste in place.
* Scene Editor: supports new Scene Key user property type.
* Scene Editor: supports new Object Variable user property type.
* [#181](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/181) Scene Editor: supports new Color user property type.

### Changed

* Scene Editor: removes the Details sub-tab from the Inspector view.
* Scene Editor: the Reset Zoom button restores the zoom and position (0, 0) of the camera. 
* [#182](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/182) macOS error: exec: "code": Executable file not found in $PATH.
* [#185](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/185) Allows uploading files with more than 10MB using the Upload dialog.

### Fixes

* Scene Editor: fixes TileSprite hit area computation in CANVAS mode. A work around Phaser's bug in RenderTexture.shapnshotPixel method.
* Scene Editor: fixes the scene thumbnail maker. Invisible containers/layers are not included in the thumbnail.
* Scene Editor: fixes viewer rendering of objects with 0 width/height. Like a Text game object with a `""` value.
* Scene Editor: fixes picking of objects under hidden parents.
* Scene Editor: fixes ordering of objects when moving to a new parent.
* Scene Editor: prevents scrolling the whole page on macOS with scrolling inertia enabled.
* Scene Editor: fixes panning with ALT key when the pointer is close to the Translate tool handlers.
* Scene Editor: fixes selection changed when panning with the ALT key.
* Scene Editor: fixes command for opening a scene file in macOS (⌘+⌥+O).
* [#200](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/200) BitmapText aligned cause NaN position.
* Scene Editor: fixes Text Content's textarea parameter in Inspector view.
* Scene Editor: adjusts the loading message position to the DPR.
* Scene Editor: adds missing `light/bitmapfont-type@2x.png` icon.
* [#29](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/29) Fixes drag & drop image in Safari.
* Workbench: prevents Safari to include the address bar in the tab/focus order.
* [#149](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/149) Renames children when pasting a container. Fixes trimming of numbering in new names.
* Editor tab label: fixes cursor type in Safari.
* Fixes cell size of viewers in screens with DPR > 1.

## v3.32.1 - Feb 27, 2022

* Scene compiler: generates the import of the super class of a scene if it is also a scene.
* [#190](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/190) Structuring the generated code so that vscode doesn't add imports to the section that gets overwritten.
* [#185](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/185) Your project exceeded the maximum number of files allowed.
* [#183](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/183) Component Option Type Scroll Issue.

## v3.32.0 - Jan 12, 2022

* Customize the editor with the new `phasereditor2d.config.json` file.
* [#168](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/168) Down Arrow in Command Palette closes palette, moves select Image in Scene Editor.
* [#171](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/pull/171) Consistent use of "Import" throughout editors.
* [#169](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/pull/169) Ctrl+Digit2 -> Ctrl+2 to look like Ctrl+3 and Ctrl+4

## v3.31.2 - Dec 14, 2021

* Update version.

## v3.31.1 - Dec 14, 2021

### Fixes

* Starter templates: webpack split chunks.
* Fixes webpack build of A day in the beach example.
* Monaco editor loads Phaser built-in type defs. It doesn't require to read the `.d.ts` files from the project.
* Property section: fixes show three-dots menu and collapsing.

## v3.31.0 - Nov 29, 2021

### Added

* [#145](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/145): BitmapText: adds support for `maxWidth` property.
* Scene editor: commands for setting default render type.

### Changed

* AllInOne: the Play Project command opens the default browser.
* Scene compiler: formats Text style JSON with a VSCode similar formatting.

### Fixed

* Scene editor: fixes Break Parent command.
* [#143](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/143) Fixes bitmap font loading when pasting a bitmap text object from other scene.
* [#154](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/154) Incorrect position values passed to super call in derived class of nested prefab.
* [150](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/150) Incorrect editor representation: Unlocked nested prefab properties aren't applied to instances of the prefab.
* Fixes serialization of default origin values in Text and BitmapText objects. It now uses `(0, 0)` in those cases.
* Always include the value of an unlocked property in the scene serialization and the code generation.
* Scene Editor: allows changing the origin of a container prefab instance with unlocked position.
* Scene Editor: fixes var name of nested prefabs.

## v3.30.0 - Sep 18, 2021

### Added

* The CodeMirror text editors.
* The allInOne commands: Open project, Close project.

### Updated

* The Monaco editor always runs on advanced mode.
* Update to latest Phaser 3.55.2.

### Remove

* Removes all features related to create and load projects. It now shows a single project at the time.

## v3.20.0 - Aug 23, 2021

### Added

* Nested prefabs:
    * Nested prefabs support.
    * Uses nullish operator (`??`) in prefab constructors.
    * Allows unlock the position of prefab instances. This change introduces a new scene format that is not compatible with previous versions of the editor.
* Good bye `prefab-awake` & `components-awake` events. Welcome `scene-awake`.
    * Updates `UserComponent.js` templates.
* Scene Editor: new Show Children In Outline parameter in the Children section.
* [#136](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/136) Prefabs: `generateAwakeHandler`.
* Compiler: adds the **Fields In Constructor (JS)** flag. Allows generating field initialization code in the constructor and no as class fields. Some transpilers don't support class fields.
* NinePatch game object support, as part of the Phaser Editor 2D Extras project.

### Updated

* [#140](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/140) Scene compiler generates code with a format compatible with VS Code. It doesn't create unneeded git diffs.
* Scene Editor: the Change Texture command allows auto unlocking the texture property.
* Scene Editor: the Layout operations allows auto unlocking of the texture property.
* Scene Editor: replaces the Container section by the Children section, and applies for Layer objects too.
* [#139](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/139)[Feature Request] add type for method in typescript.
* [#136](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/136) Prefabs: constructor ordering of custom definition props and START-USER-CTR-CODE.

### Fixed

* Scene Editor (BitmapText): fixes error when the font data isn't available in the cache.
* [#134](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/134) Creating a list in the editor results in an initialized array in the generated code.
* [#135](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/135) Word wrap width does not behave correctly
* Scene Editor: fixes Move To Parent dialog in context of prefab scenes.
* Scene Editor: fixes Scene section layout when shows a prefab's instance.
* [#142](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/142) Animations Editor: fixes changing multiple properties of the same animation.

### Removed

* Removes Parcel templates.

## v3.15.0 - Jul 11, 2021

### Fixed

* Catches project resources preloader errors.
* [#127](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/127) Fixed: the scroll height is wrong when a section is opened by default.
* Animations editor: allows setting a float value to the `frameRate`.

### Added

* Scene Editor: Select Children command.
* Scene Editor: Layout actions: Align, Align To Border, Grid.
* Scene Editor: Toggle Visibility command auto unlock prefab's visible property.
* [#132](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/132) Scene Editor: custom property definition.
* Scene compiler: emits the "prefab-awake" event in prefab instances.
* [#131](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/131) Scene Editor: supports Text word wrap properties.

## Update

* Updates Monaco Editor to v0.25.2. Improves JavaScript worker loading.
* Updates the Webpack project template. Now it uses the [Phaser Asset Pack Hashing tool](https://github.com/PhaserEditor2D/phaser-asset-pack-hashing) for distribute the files.

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
