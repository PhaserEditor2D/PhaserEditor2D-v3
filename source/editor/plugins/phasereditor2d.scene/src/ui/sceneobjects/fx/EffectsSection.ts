namespace phasereditor2d.scene.ui.sceneobjects {

    export class EffectsSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.EffectsSection", "Shader Effects", false, true);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 1);

            this.createLabel(comp, "Pre FX:", "The preFX pipeline");

            const preFXDiv = this.createGridElement(comp, 1);

            this.createLabel(comp, "Post FX:", "The postFX pipeline");

            const postFXDiv = this.createGridElement(comp, 1);

            const items = () => {

                return ScenePlugin.getInstance().getFXExtensions().map(e => ({
                    name: e.getTypeName(),
                    value: e,
                    icon: e.getIcon()
                }));
            }

            this.createMenuButton(comp, "Add", items, (value: FXObjectExtension) => {

                this.getEditor()
                    .getDropManager()
                    .addFXObjects(value);
            });

            this.addUpdater(() => {

                preFXDiv.innerHTML = "";
                postFXDiv.innerHTML = "";

                const obj = this.getSelectionFirstElement();

                const objES = obj.getEditorSupport();

                const nestedList = objES.getMutableNestedPrefabChildren()
                    .filter(obj => obj instanceof FXObject) as FXObject[];

                const appended = objES.getAppendedChildren()
                    .filter(obj => obj instanceof FXObject) as FXObject[];

                const allEffects = [...nestedList, ...appended];

                for (const fxObj of allEffects) {

                    const fxObjES = fxObj.getEditorSupport();

                    const panel = fxObj.isPreFX() ? preFXDiv : postFXDiv;

                    this.createLink(panel, fxObjES.getLabel(), () => {

                        this.getEditor().setSelection([fxObj]);
                    });
                }
            });
        }

        canEdit(obj: ISceneGameObject, n: number): boolean {

            return isGameObject(obj) && obj.getEditorSupport().isDisplayObject();
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}