namespace colibri.ui.ide {

    export abstract class EditorFactory {

        private _id: string;

        constructor(id: string) {
            this._id = id;
        }

        getId() {
            return this._id;
        }

        abstract acceptInput(input : any) : boolean;

        abstract createEditor(): EditorPart;

    }
}