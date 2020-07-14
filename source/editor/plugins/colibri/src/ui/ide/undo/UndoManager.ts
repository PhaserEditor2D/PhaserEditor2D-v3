namespace colibri.ui.ide.undo {

    export class UndoManager {

        private _undoList: Operation[];
        private _redoList: Operation[];

        constructor() {
            this._undoList = [];
            this._redoList = [];
        }

        async add(op: Operation) {

            this._undoList.push(op);
            this._redoList = [];

            await op.execute();
        }

        clear() {

            this._undoList = [];
            this._redoList = [];
        }

        undo() {

            if (this._undoList.length > 0) {

                const op = this._undoList.pop();

                op.undo();

                this._redoList.push(op);
            }
        }

        redo() {

            if (this._redoList.length > 0) {

                const op = this._redoList.pop();

                op.redo();

                this._undoList.push(op);
            }
        }
    }
}