namespace colibri.ui.ide {

    export class IconLoaderExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.IconLoaderExtension";

        static withPluginFiles(plugin: colibri.Plugin, iconNames: string[]) {

            const icons = iconNames.map(name => plugin.getIcon(name));

            return new IconLoaderExtension(icons);
        }

        private _icons: controls.IImage[];

        constructor(icons: controls.IImage[]) {
            super(IconLoaderExtension.POINT_ID);

            this._icons = icons;
        }

        getIcons() {
            return this._icons;
        }

    }

}