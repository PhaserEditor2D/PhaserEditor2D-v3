namespace phasereditor2d.scene.ui.sceneobjects {

    export class BaseObjectTool extends editor.tools.SceneTool {

        private _properties: Array<IProperty<any>>;

        constructor(config: editor.tools.ISceneToolConfig, ...properties: Array<IProperty<any>>) {
            super(config);

            this._properties = properties;
        }

        canEdit(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                for (const prop of this._properties) {

                    if (!support.hasProperty(prop)) {
                        return false;
                    }

                    if (!support.isUnlockedProperty(prop)) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canRender(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                for (const prop of this._properties) {

                    if (support.hasProperty(prop)) {
                        return true;
                    }
                }
            }

            return false;
        }
    }
}