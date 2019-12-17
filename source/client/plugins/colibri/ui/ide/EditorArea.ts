/// <reference path="./Part.ts"/>
/// <reference path="./EditorPart.ts"/>
/// <reference path="./PartFolder.ts"/>

namespace colibri.ui.ide {

    export class EditorArea extends PartFolder {

        constructor() {
            super("EditorArea");
        }

        activateEditor(editor : EditorPart) : void {
            super.selectTabWithContent(editor);
        }

        getEditors() : EditorPart[] {
            return super.getParts() as EditorPart[];
        }
    }
}