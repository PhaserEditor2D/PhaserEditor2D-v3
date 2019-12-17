
namespace colibri.ui.ide {

    export declare type ContentTypeIconExtensionConfig = {
        icon: controls.IImage,
        contentType: string
    }[];

    export class ContentTypeIconExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.ContentTypeIconExtension";

        private _config: ContentTypeIconExtensionConfig;

        static withPluginIcons(plugin: colibri.Plugin, config: {
            iconName: string,
            contentType: string,
            plugin?: colibri.Plugin
        }[]) {

            return new ContentTypeIconExtension(
                config.map(item => {
                    return {
                        icon: (item.plugin ?? plugin).getIcon(item.iconName),
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