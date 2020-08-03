/// <reference path="./PrefabUserPropertyWrapper.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class UserComponentOptionPropertyWrapper
        extends UserComponentPropertyWrapper implements IEnumProperty<ISceneObject, string> {

        constructor(userComp: ui.editor.usercomponent.UserComponent, userProp: UserProperty) {
            super(userComp, userProp);
        }

        get values() {

            return (this.getUserProperty().getType() as OptionPropertyType).getOptions();
        }

        getValueLabel(value: string) {

            return value;
        }
    }
}