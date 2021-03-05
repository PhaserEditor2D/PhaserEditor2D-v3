namespace phasereditor2d.pack.ui.editor {

    export class AssetPackEditorOutlineContentProvider extends AssetPackEditorContentProvider {

        constructor(editor: AssetPackEditor) {
            super(editor);
        }

        getRoots() {

            if (this.getPack()) {

                const types = this.getPack().getItems().map(item => item.getType());

                const set = new Set(types);

                const result = pack.core.TYPES.filter(type => set.has(type));

                return result;
            }

            return [];
        }
    }
}