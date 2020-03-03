namespace colibri.ui.ide.commands {

    export class HandlerArgs {
        constructor(
            public readonly activePart: Part,
            public readonly activeEditor: EditorPart,
            public readonly activeElement: HTMLElement,
            public readonly activeMenu: controls.Menu,
            public readonly activeWindow: ide.WorkbenchWindow,
            public readonly activeDialog: controls.dialogs.Dialog
        ) {

        }
    }

}