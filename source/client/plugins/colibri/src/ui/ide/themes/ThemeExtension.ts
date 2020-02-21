namespace colibri.ui.ide.themes {

    export class ThemeExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.ThemeExtension";

        private _theme: controls.ITheme;

        constructor(theme: controls.ITheme) {
            super(ThemeExtension.POINT_ID);

            this._theme = theme;
        }

        getTheme() {
            return this._theme;
        }
    }
}