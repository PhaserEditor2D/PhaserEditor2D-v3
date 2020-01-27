/// <reference path="./SceneObjectSection.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class GameObjectVariableSection extends SceneObjectSection<ISceneObjectLike> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectVariableSection", "Variable", false);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                // Name

                this.createLabel(comp, "Name");

                this.createStringField(comp, VariableComponent.label, false);
            }

            {
                // Type

                this.createLabel(comp, "Type");

                const text = this.createText(comp, true);

                this.addUpdater(() => {

                    text.value = this.flatValues_StringJoin(

                        this.getSelection().map(obj => {

                            const support = obj.getEditorSupport();

                            let typename = support.getObjectType();

                            if (support.isPrefabInstance()) {

                                typename = `prefab ${support.getPrefabName()} (${typename})`;
                            }

                            return typename;
                        })
                    );
                });
            }

            {
                // Scope

                this.createLabel(comp, "Scope", "The lexical scope of the object.");
                this.createEnumField(comp, VariableComponent.scope, false);
            }

            {
                // Lists

                this.createLabel(comp, "Lists", "The lists where this object belongs to.");

                const btn = this.createButton(comp, "", e => {

                    const listsRoot = this.getEditor().getScene().getObjectLists();

                    const menu = new controls.Menu();

                    const selObjIds = this.getSelection().map(obj => obj.getEditorSupport().getId());

                    const usedLists = new Set(selObjIds.flatMap(objId => listsRoot.getListsByObjectId(objId)));

                    const notUsedLists = listsRoot.getLists().filter(list => !usedLists.has(list));

                    for (const list of notUsedLists) {

                        menu.add(new controls.Action({
                            icon: controls.Controls.getIcon(colibri.ui.ide.ICON_PLUS),
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
                            icon: controls.Controls.getIcon(colibri.ui.ide.ICON_MINUS),
                            text: list.getLabel(),
                            callback: () => {

                                this.getUndoManager().add(
                                    new RemoveObjectsFromListOperation(
                                        this.getEditor(), list, this.getEditor().getSelectedGameObjects()));
                            }
                        }));
                    }

                    menu.create(e);
                });

                this.addUpdater(() => {

                    const listsRoot = this.getEditor().getScene().getObjectLists();

                    const lists = new Set(
                        this.getSelection()
                            .map(obj => obj.getEditorSupport().getId())
                            .flatMap(objId => listsRoot.getListsByObjectId(objId))
                            .map(list => list.getLabel())
                    );

                    btn.textContent = "[" + [...lists].join(",") + "]";
                });
            }
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof Phaser.GameObjects.GameObject;
        }

        canEditNumber(n: number): boolean {
            return n === 1;
        }
    }
}