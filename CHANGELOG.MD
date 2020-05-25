# Change Log

## Version 3.1.1 - May 25, 2020

### Fixed

[#33](https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/33) Wrong BitmapText default origin.

## Version 3.1.0 - May 24, 2020

### Added

* Scene Editor: use a color picker for the color properties in the Inspector view.
* Scene Editor: the origin manipulator. To select it press `O` or select it in the context menu or toolbar. It also support containers.
* Scene Editor: the Tint properties.
* Scene Editor: two scopes for transformations: local and global. You can select it in the context menu (Coords -> Global). Default is local.
* Server: shows helpful welcome messages.

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