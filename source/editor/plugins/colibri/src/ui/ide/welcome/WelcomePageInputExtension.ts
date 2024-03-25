namespace colibri.ui.ide.welcome {

    export class WelcomePageInputExtension extends colibri.ui.ide.EditorInputExtension {

        static ID = "colibri.ui.ide.welcome.WelcomePageInputExtension";

        constructor() {
            super(WelcomePageInputExtension.ID);
        }

        createEditorInput(state: any): colibri.ui.ide.IEditorInput {

            return WELCOME_PAGE_INPUT;
        }

        getEditorInputState(input: colibri.ui.ide.IEditorInput) {
            
            return {
                fullName: "WelcomePageInput"
            }
        }

        getEditorInputId(input: colibri.ui.ide.IEditorInput): string {

            return "WelcomePageInput";
        }
    }
}