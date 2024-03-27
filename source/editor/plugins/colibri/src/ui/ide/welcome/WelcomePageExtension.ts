namespace colibri.ui.ide.welcome {

    import controls = colibri.ui.controls;

    export abstract class WelcomePageExtension extends colibri.Extension {

        static POINT_ID = "colibri.ui.ide.welcome.WelcomePageExtension";

        constructor() {
            super(WelcomePageExtension.POINT_ID);
        }

        abstract buildPage(editor: WelcomePage, contentElement: HTMLDivElement): void;

        abstract getIcon(): controls.IImage;
    }
}