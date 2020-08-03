/// <reference path="../../sceneobjects/userProperties/UserProperties.ts" />
/// <reference path="../../sceneobjects/userProperties/UserComponentPropertyWrapper.ts" />
/// <reference path="../../sceneobjects/userProperties/UserComponentOptionPropertyWrapper.ts" />
namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentProperties extends sceneobjects.UserProperties {

        constructor(userComp: ui.editor.usercomponent.UserComponent) {
            super((prop: sceneobjects.UserProperty) => {

                if (prop.getType() instanceof sceneobjects.OptionPropertyType) {

                    return new sceneobjects.UserComponentOptionPropertyWrapper(userComp, prop);
                }

                return new sceneobjects.UserComponentPropertyWrapper(userComp, prop);
            });
        }
    }
}