namespace colibri.ui.ide {

    export abstract class EditorFactory {

        abstract acceptInput(input: any): boolean;

        abstract createEditor(): EditorPart;

        abstract getName();
    }
}