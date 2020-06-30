/// <reference path="./SceneObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectListSection extends SceneObjectSection<ISceneObjectLike> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectListSection", "Lists", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/lists-properties.html";
        }

        protected createForm(parent: HTMLDivElement) {

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

            const scene = this.getEditor().getScene();

            if (!scene) {

                return false;
            }

            if (obj instanceof Phaser.GameObjects.GameObject) {

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() === obj) {

                        return false;
                    }
                }

                return true;
            }

            return false;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }
}