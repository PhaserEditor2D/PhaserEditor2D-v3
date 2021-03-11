namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ParentSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page,
                "phasereditor2d.scene.ui.sceneobjects.ParentSection", "Parent", false, true,
                editor.properties.TAB_SECTION_DETAILS);
        }

        getSectionHelpPath() {

            return "scene-editor/parent-container-properties.html";
        }

        createMenu(menu: controls.Menu) {

            menu.addCommand(editor.commands.CMD_JOIN_IN_LAYER);
            menu.addCommand(editor.commands.CMD_JOIN_IN_CONTAINER);
            menu.addCommand(editor.commands.CMD_MOVE_TO_PARENT);
            menu.addCommand(editor.commands.CMD_SELECT_PARENT);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Parent", "The parent Container or Layer of the object, or the Display List");

            const btn = this.createButton(comp, "(Select)", e => {

                const dlg = new ParentDialog(this.getEditor());
                dlg.create();
                dlg.eventDialogClose.addListener(() => {

                    this.updateWithSelection();
                });
            });

            controls.Tooltip.tooltip(btn, "Moves the objects for a new container or the Display List.");

            this.addUpdater(() => {

                const sel = this.getSelection();

                const parents = sel

                    .map(obj => sceneobjects.getObjectParent(obj))

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

            return sceneobjects.isGameObject(obj);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}