namespace colibri.ui.ide.themes {


    export class ThemeExtension extends Extension {

        static POINT_ID =  "colibri.ui.ide.ThemeExtension";

        private _theme : controls.Theme;

        constructor(theme : controls.Theme) {
            super(ThemeExtension.POINT_ID);

            this._theme = theme;
        }

        getTheme() {
            return this._theme;
        }
    }
}