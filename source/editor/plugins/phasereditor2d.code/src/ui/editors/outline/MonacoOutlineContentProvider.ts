namespace phasereditor2d.code.ui.editors.outline {

    import controls = colibri.ui.controls;

    export class MonacoOutlineContentProvider implements controls.viewers.ITreeContentProvider {

        private _provider: MonacoEditorOutlineProvider;

        constructor(provider: MonacoEditorOutlineProvider) {

            this._provider = provider;
        }

        getRoots(input: any): any[] {

            return this._provider.getItems();
        }

        getChildren(parent: any): any[] {

            if (parent.childItems) {

                return parent.childItems;
            }

            return [];
        }
    }
}