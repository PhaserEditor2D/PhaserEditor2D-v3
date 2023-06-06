/// <reference path="../object/properties/PlainObjectSection.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class KeyboardKeySection extends PlainObjectSection<KeyboardKey> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.KeybardKeySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, KeyboardKeySection.ID, "Keyboard Key", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createDefaultGridElement(parent);

            this.createLabel(comp, "Key Code", "The keycode of this key");

            this.createKeyCodeField(comp, KeyboardKeyComponent.keyCode);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof KeyboardKey;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}