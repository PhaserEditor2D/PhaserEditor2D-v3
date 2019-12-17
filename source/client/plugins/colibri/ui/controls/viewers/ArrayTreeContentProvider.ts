namespace colibri.ui.controls.viewers {

    export const EMPTY_ARRAY = [];

    export class ArrayTreeContentProvider implements ITreeContentProvider {

        getRoots(input: any): any[] {
            // ok, we assume the input is an array
            return input;
        }
        
        getChildren(parent: any): any[] {
            return EMPTY_ARRAY;
        }
    }
}