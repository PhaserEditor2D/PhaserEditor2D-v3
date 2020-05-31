namespace phasereditor2d.scene.ui.sceneobjects {

    export class StringPropertyType extends UserPropertyType<string> {

        constructor() {
            super("string", "");
        }

        getName() {

            return "String";
        }

        renderValue(value: string): string {

            return value;
        }

    }
}