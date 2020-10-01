namespace phasereditor2d.scene.ui.sceneobjects {

    export class PrefabUserPropertyWrapper implements IProperty<ISceneGameObject> {

        private _userProp: UserProperty;

        constructor(userProp: UserProperty) {

            this._userProp = userProp;
        }

        getUserProperty() {

            return this._userProp;
        }

        getValue(obj: ISceneGameObject) {

            const comp = this.getComponent(obj);

            if (comp.isPropertySet(this._userProp)) {

                return this.getComponent(obj).getPropertyValue(this._userProp);
            }

            return this._userProp.getDefaultValue();
        }

        setValue(obj: ISceneGameObject, value: any): void {

            this.getComponent(obj).setPropertyValue(this._userProp, value);
        }

        private getComponent(obj: ISceneGameObject) {

            return GameObjectEditorSupport.getObjectComponent(obj, PrefabUserPropertyComponent) as PrefabUserPropertyComponent;
        }

        get name(): string {

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