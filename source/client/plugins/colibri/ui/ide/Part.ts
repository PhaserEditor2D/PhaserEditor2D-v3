/// <reference path="../controls/Controls.ts"/>

namespace colibri.ui.ide {

    export const EVENT_PART_TITLE_UPDATED = "partTitledUpdated";

    export abstract class Part extends controls.Control {

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
            this.dispatchEvent(new CustomEvent(EVENT_PART_TITLE_UPDATED, { detail: this }));
        }

        getIcon(): controls.IImage {
            return this._icon;
        }

        getId() {
            return this._id;
        }

        setSelection(selection: any[], notify = true): void {
            this._selection = selection;
            window["SELECTION"] = selection;

            if (notify) {
                this.dispatchEvent(new CustomEvent(controls.EVENT_SELECTION_CHANGED, {
                    detail: selection
                }));
            }
        }

        getSelection() {
            return this._selection;
        }

        getPropertyProvider(): controls.properties.PropertySectionProvider {
            return null;
        }

        layout(): void {

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

        }

        saveState(state: any) {

        }

        protected restoreState(state: any) {

        }

        protected abstract createPart(): void;
    }
}