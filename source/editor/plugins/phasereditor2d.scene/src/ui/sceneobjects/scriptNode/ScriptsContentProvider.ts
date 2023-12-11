namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import code = ide.core.code;

    export class ScriptsContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any[]): any[] {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const files = finder.getScriptPrefabFiles();

            files.sort((a, b) => {

                const aa = a.getFullName();
                const bb = b.getFullName();

                return aa.localeCompare(bb);
            });

            files.sort((a, b) => {

                const aa = code.isNodeLibraryFile(a) || code.isCopiedLibraryFile(a)  ? -1 : 1;
                const bb = code.isNodeLibraryFile(b) || code.isCopiedLibraryFile(b) ? -1 : 1;

                return aa - bb;
            });

            const folders: io.FilePath[] = [];

            for (const file of files) {

                let parent = file.getParent();

                if (folders.indexOf(parent) < 0) {

                    folders.push(parent);
                }
            }

            return [ScriptNodeExtension.getInstance(), ...folders];
        }

        getChildren(parent: any): any[] {

            if (parent instanceof io.FilePath) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const files = finder.getScriptPrefabFiles();

                return files.filter(f => f.getParent() === parent);
            }

            return [];
        }
    }
}