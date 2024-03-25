namespace colibri.ui.ide.welcome {

    export class WelcomePageInput implements IEditorInput {

        constructor() {

        }

        getEditorInputExtension() {

            return WelcomePageInputExtension.ID;
        };
    }

    export const WELCOME_PAGE_INPUT = new WelcomePageInput();
}