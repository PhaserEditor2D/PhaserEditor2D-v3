/// <reference path="./Operation.ts" />

namespace colibri.ui.ide.undo {

    export class MultiOperation extends Operation {

        private _list: Operation[];

        constructor(list: Operation[]) {
            super();

            this._list = list;
        }

        execute() {

            for (const op of this._list) {
                op.execute();
            }
        }

        undo(): void {

            for (const op of this._list) {

                op.undo();
            }
        }

        redo(): void {

            for (const op of this._list) {

                op.redo();
            }
        }
    }
}