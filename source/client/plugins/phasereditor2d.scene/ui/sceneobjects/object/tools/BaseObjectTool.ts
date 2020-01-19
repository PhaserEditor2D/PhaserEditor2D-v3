namespace phasereditor2d.scene.ui.sceneobjects {

    export class BaseObjectTool extends editor.tools.SceneTool {

        private _properties: Array<IProperty<any>>;

        constructor(id: string, ...properties: Array<IProperty<any>>) {
            super(id);

            this._properties = properties;
        }

        canEdit(obj: unknown): boolean {

            if (obj instanceof Phaser.GameObjects.GameObject) {

                const support = (obj as unknown as ISceneObject).getEditorSupport();

                for (const prop of this._properties) {

                    if (!support.hasProperty(prop)) {
                        return false;
                    }

                    if (!support.isUnlockedProperty(prop.name)) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canRender(obj: unknown): boolean {

            if (obj instanceof Phaser.GameObjects.GameObject) {

                const support = (obj as unknown as ISceneObject).getEditorSupport();

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