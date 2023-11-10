namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        protected _editor: SceneEditor;
        private _includeUserComponents: boolean;

        constructor(editor: SceneEditor, includeUserComponents = false) {

            this._editor = editor;
            this._includeUserComponents = includeUserComponents;
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

            if (scene.getObjectLists().getLists().length > 0) {

                roots.push(scene.getObjectLists());
            }

            if (!scene.isScriptNodePrefabScene()) {

                roots.push(...ScenePlugin.getInstance().getPlainObjectCategories().filter(cat => {

                    return this.getChildren(cat).length > 0;
                }));
            }

            if (!scene.isPrefabSceneType()
                && scene.getCodeSnippets().getSnippets().length > 0) {

                roots.push(scene.getCodeSnippets());
            }

            if (scene.isPrefabSceneType()) {

                roots.push(scene.getPrefabUserProperties());
            }

            return roots;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof codesnippets.CodeSnippets) {

                return parent.getSnippets();
            }

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

                    const prefabChildren: sceneobjects.ISceneGameObject[] = [];

                    this.getPublicMutableNestedPrefabChildren(parent, prefabChildren);

                    const appendedChildren = parentES.getAppendedChildren();

                    list = [...prefabChildren.reverse(), ...appendedChildren.reverse()];

                } else {

                    list = [...parentES.getObjectChildren()];

                    list.reverse();
                }

                if (this._includeUserComponents) {

                    // prepend the user components

                    const compNodes = parentES
                        .getUserComponentsComponent()
                        .getUserComponentNodes()
                        .filter(n => n.isPublished());

                    list = [...compNodes, ...list];
                }

                return list;
            }

            if (parent instanceof Phaser.GameObjects.DisplayList) {

                const list = [...parent.getChildren()];

                list.reverse();

                return list;

            } else if (parent instanceof sceneobjects.ObjectLists) {

                return parent.getLists();

            } else if (parent instanceof sceneobjects.ObjectList) {

                const scene = this._editor.getScene();

                return parent.getItemsWithObjects(scene);

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

        private getPublicMutableNestedPrefabChildren(parent: sceneobjects.ISceneGameObject, list: sceneobjects.ISceneGameObject[]) {

            const parentES = parent.getEditorSupport();

            for (const child of parentES.getMutableNestedPrefabChildren()) {

                const childES = child.getEditorSupport();

                if (childES.isMutableNestedPrefabInstance()) {

                    if (childES.isPrivateNestedPrefabInstance()) {

                        this.getPublicMutableNestedPrefabChildren(child, list);

                    } else {

                        list.push(child);
                    }
                }
            }
        }
    }
}