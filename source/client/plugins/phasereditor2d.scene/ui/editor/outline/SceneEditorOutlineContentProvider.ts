namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const editor: SceneEditor = input;

            const displayList = editor.getScene().sys.displayList;

            const roots = [];

            if (displayList) {

                roots.push(displayList);
            }

            roots.push(editor.getScene().getObjectLists());

            return roots;
        }

        getChildren(parent: sceneobjects.ISceneObject): any[] {

            if (parent instanceof Phaser.GameObjects.DisplayList) {

                return parent.getChildren();

            } else if (parent instanceof Phaser.GameObjects.Container) {

                if (parent.getEditorSupport().isPrefabInstance()) {

                    return [];
                }

                return parent.list;

            } else if (parent instanceof sceneobjects.ObjectLists) {

                return parent.getLists();
            }

            return [];
        }

    }
}