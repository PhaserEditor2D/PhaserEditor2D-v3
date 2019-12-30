namespace colibri.ui.ide {

    export abstract class EditorInputExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.EditorInputExtension";

        private _id: string;

        constructor(id: string) {
            super(EditorInputExtension.POINT_ID);

            this._id = id;
        }

        getId() {
            return this._id;
        }

        abstract createEditorInput(state: any): IEditorInput;

        abstract getEditorInputState(input: IEditorInput): any;

        abstract getEditorInputId(input: IEditorInput): string;
    }
}