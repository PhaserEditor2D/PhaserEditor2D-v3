namespace phasereditor2d.scene.ui.sceneobjects {

    export class KeyboardKeyComponent extends PlainObjectComponent<KeyboardKey>  {

        static keyCode = SimpleProperty("keyCode", "SPACE", "Key Code", "The keycode of this key.", true);

        constructor(obj: KeyboardKey) {
            super(obj, KeyboardKeyComponent.keyCode);
        }
    }
}