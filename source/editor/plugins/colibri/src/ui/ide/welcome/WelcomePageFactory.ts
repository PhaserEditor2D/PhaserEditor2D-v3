namespace colibri.ui.ide.welcome {

    export class WelcomePageFactory implements colibri.ui.ide.EditorFactory {

        acceptInput(input: any): boolean {

            return input === WELCOME_PAGE_INPUT;
        }

        createEditor(): colibri.ui.ide.EditorPart {

            return new WelcomePage();
        }

        getName() {

            return "Welcome Page";
        }
    }
}