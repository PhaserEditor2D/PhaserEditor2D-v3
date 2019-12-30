namespace colibri.ui.ide {

    export declare type CreateWindowFunc = () => WorkbenchWindow;

    export class WindowExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.WindowExtension";

        private _createWindowFunc: CreateWindowFunc;

        constructor(createWindowFunc: CreateWindowFunc) {
            super(WindowExtension.POINT_ID, 10);

            this._createWindowFunc = createWindowFunc;
        }

        createWindow() {
            return this._createWindowFunc();
        }
    }
}