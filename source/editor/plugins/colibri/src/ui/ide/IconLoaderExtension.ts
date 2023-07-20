namespace colibri.ui.ide {

    export class IconLoaderExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.IconLoaderExtension";

        static withPluginFiles(plugin: colibri.Plugin, iconNames: string[], common: boolean = false) {

            const icons = iconNames.map(name => plugin.getIcon(name, common));

            return new IconLoaderExtension(icons);
        }

        private _icons: controls.IconImage[];

        constructor(icons: controls.IconImage[]) {
            super(IconLoaderExtension.POINT_ID);

            this._icons = icons;
        }

        getIcons() {
            
            return this._icons;
        }

    }

}