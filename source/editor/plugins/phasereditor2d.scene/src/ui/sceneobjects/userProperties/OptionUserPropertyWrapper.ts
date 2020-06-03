/// <reference path="./UserPropertyWrapper.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class OptionUserPropertyWrapper
        extends UserPropertyWrapper implements IEnumProperty<ISceneObject, string> {

        constructor(userProp: UserProperty) {
            super(userProp);
        }

        get values() {

            return (this.getUserProperty().getType() as OptionPropertyType).getOptions();
        }

        getValueLabel(value: string) {

            return value;
        }
    }
}