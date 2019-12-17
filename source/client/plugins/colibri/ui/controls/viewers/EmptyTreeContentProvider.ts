namespace colibri.ui.controls.viewers {

    export class EmptyTreeContentProvider implements ITreeContentProvider {

        getRoots(input: any): any[] {
            return EMPTY_ARRAY;
        }

        getChildren(parent: any): any[] {
            return EMPTY_ARRAY;
        }

    }
}