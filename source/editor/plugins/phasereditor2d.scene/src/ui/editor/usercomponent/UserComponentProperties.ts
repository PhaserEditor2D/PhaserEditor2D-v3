/// <reference path="../../sceneobjects/userProperties/UserProperties.ts" />
/// <reference path="../../sceneobjects/userProperties/UserComponentPropertyWrapper.ts" />
/// <reference path="../../sceneobjects/userProperties/UserComponentOptionPropertyWrapper.ts" />
namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentProperties extends sceneobjects.UserProperties {

        private _userComponent: UserComponent;

        constructor(userComponent: UserComponent) {
            super((prop: sceneobjects.UserProperty) => {

                if (prop.getType() instanceof sceneobjects.OptionPropertyType) {

                    return new sceneobjects.UserComponentOptionPropertyWrapper(userComponent, prop);
                }

                return new sceneobjects.UserComponentPropertyWrapper(userComponent, prop);
            });

            this._userComponent = userComponent;
        }

        getUserComponent() {

            return this._userComponent;
        }
    }
}