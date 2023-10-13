namespace phasereditor2d.pack.ui.editor {

    export class AssetPackEditorOutlineContentProvider extends AssetPackEditorContentProvider {

        constructor(editor: AssetPackEditor) {
            super(editor);
        }

        getRoots() {

            if (this.getPack()) {

                const types = this.getPack().getItems().map(item => item.getType());

                const set = new Set(types);

                const result = AssetPackPlugin.getInstance().getAssetPackItemTypes()
                    .filter(type => set.has(type));

                return result;
            }

            return [];
        }

        getChildren(parent: any): any[] {

            if (parent instanceof core.SpineAssetPackItem) {

                return parent.getGuessSkinItems();
            }

            if (parent instanceof core.BaseAnimationsAssetPackItem) {

                return parent.getAnimations();
            }

            return super.getChildren(parent);
        }
    }
}