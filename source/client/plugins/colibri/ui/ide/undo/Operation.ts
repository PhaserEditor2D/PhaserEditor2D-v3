namespace colibri.ui.ide.undo {

    export abstract class Operation {

        abstract undo() : void;

        abstract redo() : void;

    }

}