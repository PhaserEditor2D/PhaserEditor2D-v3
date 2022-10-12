namespace phasereditor2d.scene.ui.sceneobjects {

    export class BaseObjectTool extends editor.tools.SceneTool {

        private _properties: Array<IProperty<any>>;

        constructor(config: editor.tools.ISceneToolConfig, ...properties: Array<IProperty<any>>) {
            super(config);

            this._properties = properties;
        }

        protected getProperties(obj?: any) {

            return this._properties;
        }

        canEdit(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                const props = this.getProperties(obj);

                for (const prop of props) {

                    if (!support.hasProperty(prop)) {

                        return false;
                    }

                    if (!support.isUnlockedProperty(prop)) {

                        return false;
                    }
                }

                return props.length > 0;
            }

            return false;
        }

        canRender(obj: unknown): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const support = (obj as unknown as ISceneGameObject).getEditorSupport();

                const props = this.getProperties(obj);

                for (const prop of props) {

                    if (support.hasProperty(prop)) {

                        return true;
                    }
                }
            }

            return false;
        }

        async confirmUnlockProperty(args: editor.tools.ISceneToolContextArgs, props: Array<IProperty<any>>, propLabel: string, ...sectionId: string[]) {

            await args.editor.confirmUnlockProperty(props, propLabel, ...sectionId);
        }
    }
}