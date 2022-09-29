/// <reference path="./SceneGameObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectListSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectListSection", "Lists", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/lists-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createLabel(comp, "Lists", "The lists where this object belongs to.");

            const btn = this.createButton(comp, "", e => {

                const listsRoot = this.getEditor().getScene().getObjectLists();

                const menu = new controls.Menu();

                const selObjIds = this.getSelection().map(obj => obj.getEditorSupport().getId());

                const usedLists = new Set(selObjIds.flatMap(objId => listsRoot.getListsByObjectId(objId)));

                const notUsedLists = listsRoot.getLists().filter(list => !usedLists.has(list));

                for (const list of notUsedLists) {

                    menu.add(new controls.Action({
                        icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS),
                        text: list.getLabel(),
                        callback: () => {

                            this.getUndoManager().add(
                                new AddObjectsToListOperation(
                                    this.getEditor(), list, this.getEditor().getSelectedGameObjects()));

                        }
                    }));
                }

                menu.addSeparator();

                for (const list of usedLists) {

                    menu.add(new controls.Action({
                        icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_MINUS),
                        text: list.getLabel(),
                        callback: () => {

                            this.getUndoManager().add(
                                new RemoveObjectsFromListOperation(
                                    this.getEditor(), list, this.getEditor().getSelectedGameObjects()));
                        }
                    }));
                }

                menu.addSeparator();

                menu.add(new controls.Action({
                    text: "Add To New List",
                    callback: () => {

                        const dlg = new controls.dialogs.InputDialog();
                        dlg.create();
                        dlg.setTitle("New List");
                        dlg.setMessage("Enter the name of the new list");
                        dlg.setInitialValue("list");
                        dlg.setInputValidator(name => {

                            return this.getEditor().getScene().getObjectLists().getLists().findIndex(list => list.getLabel() === name) < 0;
                        });
                        dlg.setResultCallback(name => {

                            this.getUndoManager().add(
                                new AddObjectsToNewListOperation(this.getEditor(), name, this.getEditor().getSelectedGameObjects()));
                        });
                        dlg.validate();
                    }
                }));

                menu.createWithEvent(e);
            });

            controls.Tooltip.tooltip(btn, "Change the lists containing this object.");

            this.addUpdater(() => {

                const scene = this.getEditor().getScene();

                if (!scene) {

                    return;
                }

                const listsRoot = scene.getObjectLists();

                const lists = new Set(
                    this.getSelection()
                        .map(obj => obj.getEditorSupport().getId())
                        .flatMap(objId => listsRoot.getListsByObjectId(objId))
                        .map(list => list.getLabel())
                );

                btn.textContent = "[" + [...lists].join(",") + "]";
            });
        }

        canEdit(obj: any, n: number): boolean {

            return sceneobjects.isGameObject(obj) && !this.isPrefabSceneObject(obj);
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}