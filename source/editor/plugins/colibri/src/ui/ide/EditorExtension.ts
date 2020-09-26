namespace colibri.ui.ide {

    export class EditorExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.EditorExtension";

        private _factories: EditorFactory[];

        constructor(factories: EditorFactory[]) {
            super(EditorExtension.POINT_ID);

            this._factories = factories;
        }

        getFactories() {
            return this._factories;
        }
    }
}