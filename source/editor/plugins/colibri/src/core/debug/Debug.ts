namespace colibri.debug {

    export function getEditorSelectedObject() {

        return getEditorSelection()[0];
    }

    export function getEditorSelection() {

        return colibri.Platform.getWorkbench().getActiveEditor().getSelection();
    }

    export function getPartSelection() {

        return colibri.Platform.getWorkbench().getActivePart().getSelection();
    }

    export function getPartSelectedObject() {

        return getPartSelection()[0];
    }
}