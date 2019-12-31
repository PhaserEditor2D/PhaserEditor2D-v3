namespace phasereditor2d.pack.ui.editor {

    import io = colibri.core.io;

    export class IgnoreFileSet extends Set<io.FilePath> {

        private _editor: AssetPackEditor;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
        }

        async updateIgnoreFileSet_async() {

            const packs = (await core.AssetPackUtils.getAllPacks())
                .filter(pack => pack.getFile() !== this._editor.getInput());

            this.clear();

            for (const pack of packs) {
                pack.computeUsedFiles(this);
            }

            this._editor.getPack().computeUsedFiles(this);
        }

    }
}