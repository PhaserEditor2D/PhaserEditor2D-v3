namespace colibri.ui.ide {

    export class IconAtlasLoaderExtension extends Extension {
        
        static POINT_ID = "colibri.ui.ide.IconAtlasLoaderExtension";
        private _plugin: Plugin;

        constructor(plugin: Plugin) {
            super(IconAtlasLoaderExtension.POINT_ID);

            this._plugin = plugin;
        }

        async preload() {

            await this._plugin.preloadAtlasIcons();
        }
    }
}