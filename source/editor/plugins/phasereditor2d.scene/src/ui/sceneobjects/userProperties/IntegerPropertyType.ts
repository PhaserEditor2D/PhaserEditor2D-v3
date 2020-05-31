/// <reference path="NumberPropertyType.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class IntegerPropertyType extends NumberPropertyType {

        getName() {

            return "Integer";
        }

        renderValue(value: number) {

            return Math.floor(value).toString();
        }
    }
}