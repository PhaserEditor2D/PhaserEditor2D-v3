/// <reference path="./PrefabUserPropertyWrapper.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PrefabOptionUserPropertyWrapper
        extends PrefabUserPropertyWrapper implements IEnumProperty<ISceneGameObject, string> {

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