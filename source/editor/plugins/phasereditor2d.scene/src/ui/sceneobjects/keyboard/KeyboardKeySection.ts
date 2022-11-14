/// <reference path="../object/properties/PlainObjectSection.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class KeyboardKeySection extends PlainObjectSection<KeyboardKey> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.KeybardKeySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, KeyboardKeySection.ID, "Keyboard Key", false, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createDefaultGridElement(parent);

            this.createLabel(comp, "Key Code", "The keycode of this key");

            const btn = this.createButton(comp, "KeyCode", e => {
                
                const viewer = new controls.viewers.TreeViewer(KeyboardKeySection.ID + ".keyCodes");
                viewer.setLabelProvider(new controls.viewers.LabelProvider(obj => obj));
                viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider());
                viewer.setInput(KeyboardKeyExtension.getInstance().getKeyCodes());
                viewer.revealAndSelect(this.getSelectionFirstElement().keyCode);

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);
                
                dlg.create();

                dlg.setTitle("Select The KeyCode");
                
                dlg.addOpenButton("Select", (sel) => {

                    const value = sel[0];

                    this.getEditor().getUndoManager().add(
                        new SimpleOperation(this.getEditor(), this.getSelection(), KeyboardKeyComponent.keyCode, value));

                }, false);

                dlg.addCancelButton();
            });

            this.addUpdater(() => {

                btn.textContent = this.flatValues_StringOneOrNothing(this.getSelection().map(k => k.keyCode));
            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof KeyboardKey;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}