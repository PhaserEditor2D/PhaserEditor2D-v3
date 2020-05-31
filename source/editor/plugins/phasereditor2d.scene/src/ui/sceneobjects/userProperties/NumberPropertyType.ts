/// <reference path="UserPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class NumberPropertyType extends UserPropertyType<number> {

        constructor() {
            super("number", 0);
        }

        getName() {

            return "Number";
        }

        renderValue(value: number): string {

            if (value === null || value === undefined) {

                return "";
            }

            return value.toString();
        }

    }
}