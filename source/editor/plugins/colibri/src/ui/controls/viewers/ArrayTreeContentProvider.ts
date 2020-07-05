namespace colibri.ui.controls.viewers {

    export const EMPTY_ARRAY = [];

    export class ArrayTreeContentProvider implements ITreeContentProvider {

        getRoots(input: any): any[] {

            if (!Array.isArray(input)) {
                return [];
            }

            return input;
        }

        getChildren(parent: any): any[] {
            return EMPTY_ARRAY;
        }
    }
}