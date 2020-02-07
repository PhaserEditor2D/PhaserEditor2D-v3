namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export interface IHasParentContainer extends ISceneObject {

        parentContainer: Container;
    }

    export class ParentSection extends SceneObjectSection<IHasParentContainer> {

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.ParentSection", "Parent Container", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Parent");

            const btn = this.createButton(comp, "(Select)", e => {

                const dlg = new ParentDialog(this.getEditor());
                dlg.create();
            });

            this.addUpdater(() => {

                const sel = this.getSelection();

                const parents = sel

                    .map(obj => obj.parentContainer as Container)

                    .filter(cont => cont);

                const parentsSet = new Set(parents);

                let str: string;

                if (parentsSet.size === 1 && parents.length === sel.length) {

                    str = parents[0].getEditorSupport().getLabel();

                } else if (parents.length === 0) {

                    str = "Display List";

                } else {

                    str = `(${parentsSet.size} selected)`;
                }

                btn.textContent = str;
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Phaser.GameObjects.GameObject
                && !(obj instanceof Container);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}