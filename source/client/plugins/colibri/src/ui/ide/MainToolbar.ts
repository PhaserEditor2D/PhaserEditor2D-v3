namespace colibri.ui.ide {

    export class MainToolbar extends controls.Control {

        private _leftArea: HTMLElement;
        private _centerArea: HTMLElement;
        private _rightArea: HTMLElement;
        private _currentManager: controls.ToolbarManager;

        constructor() {
            super("div", "MainToolbar");

            this._currentManager = null;

            const element = this.getElement();

            this._leftArea = document.createElement("div");
            this._leftArea.classList.add("MainToolbarLeftArea");
            element.appendChild(this._leftArea);

            this._centerArea = document.createElement("div");
            this._centerArea.classList.add("MainToolbarCenterArea");
            element.appendChild(this._centerArea);

            this._rightArea = document.createElement("div");
            this._rightArea.classList.add("MainToolbarRightArea");
            element.appendChild(this._rightArea);

            ide.Workbench.getWorkbench().addEventListener(ide.EVENT_EDITOR_ACTIVATED, e => this.onEditorActivated());
        }

        getLeftArea() {
            return this._leftArea;
        }

        getCenterArea() {
            return this._centerArea;
        }

        getRightArea() {
            return this._rightArea;
        }

        private onEditorActivated() {

            const editor = ide.Workbench.getWorkbench().getActiveEditor();

            if (this._currentManager) {

                this._currentManager.dispose();
                this._currentManager = null;
            }

            if (editor) {

                const manager = editor.createEditorToolbar(this._centerArea);
                this._currentManager = manager;
            }
        }
    }

}