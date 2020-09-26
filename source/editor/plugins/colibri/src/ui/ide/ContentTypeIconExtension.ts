
namespace colibri.ui.ide {

    export declare type ContentTypeIconExtensionConfig = Array<{
        iconDescriptor: controls.IconDescriptor,
        contentType: string
    }>;

    export class ContentTypeIconExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.ContentTypeIconExtension";

        private _config: ContentTypeIconExtensionConfig;

        static withPluginIcons(plugin: colibri.Plugin, config: Array<{
            plugin?: Plugin;
            iconName: string;
            contentType: string;
        }>) {

            return new ContentTypeIconExtension(
                config.map(item => {
                    return {
                        iconDescriptor: (item.plugin || plugin).getIconDescriptor(item.iconName),
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