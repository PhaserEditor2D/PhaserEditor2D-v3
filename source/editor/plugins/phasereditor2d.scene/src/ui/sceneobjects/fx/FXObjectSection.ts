namespace phasereditor2d.scene.ui.sceneobjects {

    export class FXObjectSection extends SceneGameObjectSection<FXObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.FXObjectSection", "FX", false, true);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Change Pipeline", "Change the FX to a different pipeline.");

            const btn = this.createMenuButton(comp, "", () => [
                {
                    name: "Pre FX",
                    value: "preFX"
                },
                {
                    name: "Post FX",
                    value: "postFX"
                }
            ], value => {

                const op = new editor.undo.SceneSnapshotOperation(this.getEditor(), async () => {

                    const ids = this.getSelection()
                        .map(obj => obj.getEditorSupport().getId());

                    const isPreFX = value === "preFX";

                    const syncObjects = new Set<ISceneGameObject>();

                    for (const obj of this.getSelection()) {

                        obj.setPreFX(isPreFX);

                        syncObjects.add(obj.getParent());
                    }

                    for (const obj of syncObjects) {

                        this.recreateEffects(obj);
                    }

                    this.getEditor().getSelectionManager().setSelectionByIds(ids);
                });

                this.getEditor().getUndoManager().add(op);
            });

            this.addUpdater(() => {

                const preFX = this.flatValues_BooleanAnd(this.getSelection().map(obj => obj.isPreFX()));

                btn.textContent = preFX ? "Pre FX" : "Post FX";
            });
        }

        private recreateEffects(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const data: any = {};

            objES.writeJSON(data);

            const img = obj as any as Phaser.GameObjects.Image;

            if (img.preFX) {

                img.preFX.clear();
            }

            if (img.postFX) {

                img.postFX.clear();
            }

            objES.readJSON(data);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof FXObject;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}