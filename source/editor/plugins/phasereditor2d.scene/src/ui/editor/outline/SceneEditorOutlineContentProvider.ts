namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export class SceneEditorOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const editor: SceneEditor = input;

            const scene = editor.getScene();

            if (!scene) {

                return [];
            }

            const displayList = editor.getScene().sys.displayList;

            const roots = [];

            if (displayList) {

                roots.push(displayList);
            }

            roots.push(editor.getScene().getObjectLists());

            return roots;
        }

        getChildren(parent: sceneobjects.ISceneGameObject): any[] {

            if (parent instanceof Phaser.GameObjects.DisplayList) {

                const list = [...parent.getChildren()];

                list.reverse();

                return list;

            } else if (parent instanceof Phaser.GameObjects.Container) {

                if (parent.getEditorSupport().isPrefabInstance()) {

                    return [];
                }

                const list = [...parent.list];

                list.reverse();

                return list;

            } else if (parent instanceof sceneobjects.ObjectLists) {

                return parent.getLists();
            }

            return [];
        }

    }
}