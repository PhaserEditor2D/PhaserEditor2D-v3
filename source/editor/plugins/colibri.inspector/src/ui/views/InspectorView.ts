
namespace colibri.inspector.ui.views {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    export class InspectorView extends ide.ViewPart {

        static VIEW_ID = "colibri.inspector.ui.views.InspectorView";

        private _propertyPage: controls.properties.PropertyPage;
        private _currentPart: ide.Part;
        private _selectionListener: any;

        constructor() {
            super(InspectorView.VIEW_ID);

            this.setTitle("Inspector");
            this.setIcon(InspectorPlugin.getInstance().getIcon(ICON_INSPECTOR));
        }

        layout() {

            this._propertyPage.dispatchLayoutEvent();
        }

        protected createPart() {

            this._propertyPage = new controls.properties.PropertyPage();

            this._propertyPage.getElement().addEventListener("scroll", e => {

                this.layout();
            });

            this.add(this._propertyPage);

            this._selectionListener = (e: CustomEvent) => this.onPartSelection();

            ide.Workbench.getWorkbench()
                .eventPartActivated.addListener(() => this.onWorkbenchPartActivate());
        }

        private onWorkbenchPartActivate() {

            const part = ide.Workbench.getWorkbench().getActivePart();

            if (part instanceof ide.EditorPart && part.isEmbeddedMode()) {
                // we don't want to link with embedded editors!
                return;
            }

            if (part !== this && part !== this._currentPart) {

                if (this._currentPart) {

                    this._currentPart.eventSelectionChanged.removeListener(this._selectionListener);
                }

                this._currentPart = part;

                if (part) {

                    part.eventSelectionChanged.addListener(this._selectionListener);

                    this.onPartSelection();

                } else {

                    this._propertyPage.setSectionProvider(null);
                }
            }
        }

        private onPartSelection() {

            const sel = this._currentPart.getSelection();

            const provider = this._currentPart.getPropertyProvider();

            this._propertyPage.setSectionProvider(provider);

            this._propertyPage.setSelection(sel);
        }

        getUndoManager() {

            if (this._currentPart) {

                const manager = this._currentPart.getUndoManager();

                if (manager) {
                    return manager;
                }
            }

            return super.getUndoManager();
        }

        getPropertyPage() {

            return this._propertyPage;
        }
    }
}