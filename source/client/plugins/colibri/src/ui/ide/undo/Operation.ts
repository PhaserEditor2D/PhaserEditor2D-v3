namespace colibri.ui.ide.undo {

    export abstract class Operation {

        abstract undo(): void;

        abstract redo(): void;

        async execute(): Promise<any> {
            // nothing by default
        }
    }
}