namespace phasereditor2d.pack.ui.editor {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AssetPackEditorBlocksContentProvider extends files.ui.viewers.FileTreeContentProvider {

        private _editor: AssetPackEditor;
        private _ignoreFileSet: IgnoreFileSet;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
            this._ignoreFileSet = new IgnoreFileSet(editor);
        }

        getIgnoreFileSet() {
            return this._ignoreFileSet;
        }

        async updateIgnoreFileSet_async() {
            await this._ignoreFileSet.updateIgnoreFileSet_async();
        }

        getFolders(parent: io.FilePath, folders: io.FilePath[]) {

            for (const file of parent.getFiles()) {

                if (file.isFile() && this.acceptFile(file)) {

                    if (folders.indexOf(parent) < 0) {

                        folders.push(parent);
                        break;
                    }
                }

                this.getFolders(file, folders);
            }
        }

        getRoots(input: any): any[] {

            const pack = this._editor.getPack();

            if (pack && pack.isShowAllFilesInBlocks()) {

                input = colibri.Platform.getWorkbench().getFileStorage().getRoot();
            }

            const folders = [];

            if (input instanceof io.FilePath && input.isFolder()) {

                folders.push(input);
            }

            const roots = super.getRoots(input);

            for (const file of roots) {

                this.getFolders(file, folders);
            }

            return folders;
        }

        getChildren(parent: any): any[] {

            return super.getChildren(parent)

                .filter(obj => this.acceptFile(obj));
        }

        private acceptFile(parent: io.FilePath) {

            if (parent.isFile() && !this._ignoreFileSet.has(parent)) {

                // TODO: we should create an extension point to know
                // what files are created by the editor and are not
                // intended to be imported in the asset pack.
                if (parent.getExtension() === "scene" || parent.getExtension() === "components") {

                    return false;
                }

                return true;
            }

            return false;
        }
    }

}