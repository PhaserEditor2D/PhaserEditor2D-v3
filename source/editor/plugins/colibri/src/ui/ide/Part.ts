/// <reference path="../controls/Controls.ts"/>

namespace colibri.ui.ide {

    export abstract class Part extends controls.Control {

        public eventPartTitleChanged = new controls.ListenerList();
        private _id: string;
        private _title: string;
        private _selection: any[];
        private _partCreated: boolean;
        private _icon: controls.IImage;
        private _folder: PartFolder;
        private _undoManager: undo.UndoManager;
        private _restoreState: any;

        constructor(id: string) {
            super();

            this._id = id;

            this._title = "";

            this._selection = [];

            this._partCreated = false;

            this._restoreState = null;

            this._undoManager = new undo.UndoManager();

            this.getElement().setAttribute("id", id);

            this.getElement().classList.add("Part");

            this.getElement()["__part"] = this;
        }

        setRestoreState(state: any) {
            this._restoreState = state;
        }

        getUndoManager() {
            return this._undoManager;
        }

        getPartFolder() {
            return this._folder;
        }

        setPartFolder(folder: PartFolder) {
            this._folder = folder;
        }

        getTitle() {
            return this._title;
        }

        setTitle(title: string): void {
            this._title = title;
            this.dispatchTitleUpdatedEvent();
        }

        setIcon(icon: controls.IImage) {
            this._icon = icon;
            this.dispatchTitleUpdatedEvent();
        }

        dispatchTitleUpdatedEvent() {

            this.eventPartTitleChanged.fire(this);
        }

        getIcon(): controls.IImage {
            return this._icon;
        }

        getId() {
            return this._id;
        }

        setSelection(selection: any[], notify = true): void {

            this._selection = selection;

            if (notify) {

                this.dispatchSelectionChanged();
            }
        }

        getSelection() {
            
            return this._selection;
        }

        dispatchSelectionChanged() {

            this.eventSelectionChanged.fire(this._selection);
        }

        getPropertyProvider(): controls.properties.PropertySectionProvider {
            return null;
        }

        layout(): void {
            // nothing
        }

        onWindowFocus() {
            // nothing
        }

        onPartAdded() {
            // nothing
        }

        onPartClosed(): boolean {
            return true;
        }

        onPartShown(): void {

            if (!this._partCreated) {

                this._partCreated = true;

                this.doCreatePart();

                if (this._restoreState) {

                    try {

                        this.restoreState(this._restoreState);
                        this._restoreState = null;

                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        protected doCreatePart() {
            this.createPart();
        }

        onPartActivated() {
            // nothing
        }

        onPartDeactivated() {
            // nothing
        }

        saveState(state: any) {
            // nothing
        }

        protected restoreState(state: any) {
            // nothing
        }

        protected abstract createPart(): void;
    }
}