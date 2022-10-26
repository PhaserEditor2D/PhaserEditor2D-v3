namespace phasereditor2d.scene.ui.sceneobjects {

    import UserComponent = editor.usercomponent.UserComponent;
    import io = colibri.core.io;

    export class UserComponentNode {

        private _obj: ISceneGameObject;
        private _userComponent: UserComponent;
        private _prefabFile?: io.FilePath;

        static computeKey(obj: ISceneGameObject, userComponent: UserComponent, prefabFile?: io.FilePath) {

            const prefabFileKey = prefabFile? prefabFile.getFullName() : "";
            const compKey = userComponent.getName();
            const objKey = obj.getEditorSupport().getId();
            
            const key = `${prefabFileKey}${compKey}#${objKey}`;

            return key;
        }

        constructor(obj: ISceneGameObject, userComponent: UserComponent, prefabFile?: io.FilePath) {
            
            this._obj = obj;
            this._userComponent = userComponent;
            this._prefabFile = prefabFile;
        }

        getId() {

            return `${this._obj.getEditorSupport().getId()}#${this._userComponent.getName()}`;
        }

        getObject() {

            return this._obj;
        }

        isPublished() {

            return this.getUserComponentsComponent().isComponentPublished(this.getComponentName());
        }

        getUserComponent() {

            return this._userComponent;
        }

        getComponentName() {

            return this._userComponent.getName();
        }

        getUserComponentsComponent() {

            return this._obj.getEditorSupport().getUserComponentsComponent();
        }

        getPrefabFile() {

            return this._prefabFile;
        }

        isPrefabDefined() {

            return this._prefabFile !== undefined;
        }
    }
}