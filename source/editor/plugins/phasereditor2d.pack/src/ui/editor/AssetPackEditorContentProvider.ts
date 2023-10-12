/// <reference path="../viewers/AssetPackContentProvider.ts" />

namespace phasereditor2d.pack.ui.editor {

    export class AssetPackEditorContentProvider extends viewers.AssetPackContentProvider {

        private _editor: AssetPackEditor;

        constructor(editor: AssetPackEditor) {
            super();

            this._editor = editor;
        }

        getPack() {

            return this._editor.getPack();
        }

        getRoots(input: any) {

            const types = AssetPackPlugin.getInstance().getAssetPackItemTypes()
                .filter(type => type === core.ATLAS_TYPE 
                    || type === core.SPINE_ATLAS_TYPE
                    || type.toLowerCase().indexOf("atlas") < 0);

            return types;
        }

        getChildren(parent: any): any[] {

            if (typeof (parent) === "string") {
                
                const type = parent;

                if (this.getPack()) {

                    const children =
                        this.getPack().getItems()

                            .filter(item => {

                                if (core.AssetPackUtils.isAtlasType(type)
                                    && core.AssetPackUtils.isAtlasType(item.getType())) {

                                    return true;
                                }

                                return item.getType() === type;
                            });

                    return children;
                }
            }

            return super.getChildren(parent);
        }

    }

}