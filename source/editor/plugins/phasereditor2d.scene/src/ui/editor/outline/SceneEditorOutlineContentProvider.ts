namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        protected _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;
        }

        getRoots(input: any): any[] {

            const scene = this._editor.getScene();

            if (!scene) {

                return [];
            }

            const displayList = scene.sys.displayList;

            const roots = [];

            if (displayList) {

                roots.push(displayList);
            }

            roots.push(scene.getObjectLists());

            roots.push(...ScenePlugin.getInstance().getPlainObjectCategories());

            if (scene.isPrefabSceneType()) {

                roots.push(scene.getPrefabUserProperties());
            }

            return roots;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof sceneobjects.PrefabUserProperties) {

                return parent.getProperties();
            }

            if (sceneobjects.GameObjectEditorSupport.hasEditorSupport(parent)) {

                const parentObj = parent as sceneobjects.ISceneGameObject;

                let list = [];

                const parentES = parentObj.getEditorSupport();

                if (!parentES.isShowChildrenInOutline()) {

                    list = [];

                } else if (parentES.isPrefabInstance()) {

                    const prefabChildren = parentES.getMutableNestedPrefabChildren();

                    const appendedChildren = parentES.getAppendedChildren();

                    list = [...prefabChildren, ...appendedChildren];

                } else {

                    list = [...parentES.getObjectChildren()];

                    list.reverse();
                }

                // prepend the user components

                const compNodes = parentES
                    .getUserComponentsComponent()
                    .getUserComponentNodes()
                    .filter(n => n.isPublished());

                list = [...compNodes, ...list];

                return list;
            }

            if (parent instanceof Phaser.GameObjects.DisplayList) {

                const list = [...parent.getChildren()];

                list.reverse();

                return list;

            } else if (parent instanceof sceneobjects.ObjectLists) {

                return parent.getLists();

            } else if (typeof parent === "string") {

                return this._editor.getScene().getPlainObjectsByCategory(parent);
            }

            const extensions = ScenePlugin.getInstance().getSceneEditorOutlineExtensions();

            for (const ext of extensions) {

                if (ext.isContentProviderFor(parent)) {

                    return ext.getContentProvider().getChildren(parent);
                }
            }

            return [];
        }
    }
}