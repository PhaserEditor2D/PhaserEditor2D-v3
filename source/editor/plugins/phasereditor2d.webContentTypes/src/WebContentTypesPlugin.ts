namespace phasereditor2d.webContentTypes {

    export class WebContentTypesPlugin extends colibri.Plugin {

        private static _instance: WebContentTypesPlugin;

        static getInstance() {

            if (!this._instance) {
                this._instance = new WebContentTypesPlugin();
            }

            return this._instance;
        }

        constructor() {
            super("phasereditor2d.webContentTypes");
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // content types

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new core.DefaultExtensionTypeResolver()],
                    1000
                ));

            // content type icons

            reg.addExtension(
                colibri.ui.ide.ContentTypeIconExtension.withPluginIcons(icons.IconsPlugin.getInstance(), [
                    {
                        iconName: icons.ICON_FILE_IMAGE,
                        contentType: core.CONTENT_TYPE_IMAGE
                    },
                    {
                        iconName: icons.ICON_FILE_IMAGE,
                        contentType: core.CONTENT_TYPE_SVG
                    },
                    {
                        iconName: icons.ICON_FILE_SOUND,
                        contentType: core.CONTENT_TYPE_AUDIO
                    },
                    {
                        iconName: icons.ICON_FILE_VIDEO,
                        contentType: core.CONTENT_TYPE_VIDEO
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_SCRIPT
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_JAVASCRIPT
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_TYPESCRIPT
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_CSS
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_HTML
                    },
                    {
                        iconName: icons.ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_XML
                    },
                    {
                        iconName: icons.ICON_FILE_TEXT,
                        contentType: core.CONTENT_TYPE_TEXT
                    }
                ]));
        }
    }

    colibri.Platform.addPlugin(WebContentTypesPlugin.getInstance());
}