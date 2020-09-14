
namespace colibri.ui.ide {

    export declare type ContentTypeIconExtensionConfig = Array<{
        plugin?: colibri.Plugin,
        iconName: string,
        contentType: string
    }>;

    export class ContentTypeIconExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.ContentTypeIconExtension";

        private _config: ContentTypeIconExtensionConfig;

        static withPluginIcons(plugin: colibri.Plugin, config: ContentTypeIconExtensionConfig) {

            return new ContentTypeIconExtension(
                config.map(item => {
                    return {
                        plugin: item.plugin ?? plugin,
                        iconName: item.iconName,
                        contentType: item.contentType
                    };
                }));
        }

        constructor(config: ContentTypeIconExtensionConfig) {
            super(ContentTypeIconExtension.POINT_ID, 10);

            this._config = config;
        }

        getConfig() {
            return this._config;
        }

    }

}