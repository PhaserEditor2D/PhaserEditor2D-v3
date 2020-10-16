namespace phasereditor2d.scene.ui.sceneobjects {

    import usercomponent = ui.editor.usercomponent;

    export class UserComponentPropertyWrapper implements IProperty<ISceneGameObject> {

        private _userProp: UserProperty;
        private _userComp: usercomponent.UserComponent;

        constructor(userComp: usercomponent.UserComponent, userProp: UserProperty) {

            this._userComp = userComp;
            this._userProp = userProp;
        }

        getUserComponent() {

            return this._userComp;
        }

        getUserProperty() {

            return this._userProp;
        }

        getValue(obj: ISceneGameObject) {

            const comp = this.getComponent(obj);

            if (comp.isPropertySet(this._userComp.getName(), this._userProp)) {

                return comp.getPropertyValue(this._userComp.getName(), this._userProp);
            }

            return this._userProp.getDefaultValue();
        }

        setValue(obj: ISceneGameObject, value: any): void {

            this.getComponent(obj).setPropertyValue(this._userComp.getName(), this._userProp, value);
        }

        private getComponent(obj: ISceneGameObject) {

            return GameObjectEditorSupport.getObjectComponent(obj, UserComponentsEditorComponent) as UserComponentsEditorComponent;
        }

        get name(): string {

            return this._userComp.getName() + "." + this._userProp.getName();
        }

        get codeName(): string {

            return this._userProp.getName();
        }

        get defValue() {

            return this._userProp.getDefaultValue();
        }

        get local() {

            return false;
        }

        get label() {

            return this._userProp.getLabel();
        }

        get tooltip() {

            return this._userProp.getTooltip();
        }
    }
}