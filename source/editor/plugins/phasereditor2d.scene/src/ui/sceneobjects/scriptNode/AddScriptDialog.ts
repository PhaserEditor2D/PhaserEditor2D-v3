namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    import code = ide.core.code;

    export class AddScriptDialog extends controls.dialogs.ViewerDialog {

        private static createViewer() {

            const viewer = new controls.viewers.TreeViewer("AddScriptsDialog");
            viewer.setStyledLabelProvider(new ScriptStyledLabelProvider());
            viewer.setLabelProvider(new controls.viewers.LabelProviderFromStyledLabelProvider(viewer.getStyledLabelProvider()));
            viewer.setContentProvider(new ScriptsContentProvider);
            viewer.setCellRendererProvider(
                new controls.viewers.EmptyCellRendererProvider(
                    e => {

                        let icon = resources.getIcon(resources.ICON_BUILD);

                        if (e instanceof io.FilePath && e.isFolder()) {

                            icon = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
                        }

                        return new controls.viewers.IconImageCellRenderer(icon)
                    }));

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const input = [ScriptNodeExtension.getInstance(), ...finder.getScriptPrefabFiles()];

            viewer.setInput(input);

            return viewer;
        }

        private _editor: ui.editor.SceneEditor;

        constructor(editor: ui.editor.SceneEditor) {
            super(AddScriptDialog.createViewer(), false);

            this._editor = editor;
        }

        create(): void {

            super.create();

            this.setTitle("Add Script");

            this.enableButtonOnlyWhenOneElementIsSelected(
                this.addOpenButton("Add Script", sel => {

                    this.addScript(sel[0]);
                }), (obj: io.FilePath | ScriptNodeExtension) => {

                    return obj instanceof ScriptNodeExtension || obj.isFile();
                });

            this.addCancelButton();
        }

        addScript(script: any) {

            this._editor.getUndoManager().add(
                new ui.editor.undo.CreateObjectWithAssetOperation(this._editor, [script], 0, 0));
        }
    }

    class ScriptStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean) {

            let text: string;
            let color: string;

            if (obj instanceof io.FilePath && obj.isFolder()) {

                if (code.isNodeModuleFile(obj)) {

                    text = code.findNodeModule(obj);
                    color = ScenePlugin.getInstance().getScriptsLibraryColor();

                } else {

                    text = obj.getName();
                    color = controls.Controls.getTheme().viewerForeground;
                }

            } else if (obj instanceof ScriptNodeExtension) {

                text = obj.getTypeName();
                color = controls.Controls.getTheme().viewerForeground;

            } else {

                text = obj.getNameWithoutExtension();
                color = ScenePlugin.getInstance().getPrefabColor();
            }

            return [{ text, color }];
        }
    }

    class ScriptsContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const files = finder.getScriptPrefabFiles();

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