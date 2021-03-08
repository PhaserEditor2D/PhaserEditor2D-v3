namespace phasereditor2d.webContentTypes {

    export const ICON_FILE_FONT = "file-font";
    export const ICON_FILE_IMAGE = "file-image";
    export const ICON_FILE_VIDEO = "file-movie";
    export const ICON_FILE_SCRIPT = "file-script";
    export const ICON_FILE_SOUND = "file-sound";
    export const ICON_FILE_TEXT = "file-text";

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

            // icons loader

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_FILE_IMAGE,
                    ICON_FILE_SOUND,
                    ICON_FILE_VIDEO,
                    ICON_FILE_SCRIPT,
                    ICON_FILE_TEXT,
                    ICON_FILE_FONT
                ])
            );

            // content types

            reg.addExtension(
                new colibri.core.ContentTypeExtension(
                    [new core.DefaultExtensionTypeResolver()],
                    1000
                ));

            // content type icons

            reg.addExtension(
                colibri.ui.ide.ContentTypeIconExtension.withPluginIcons(this, [
                    {
                        iconName: ICON_FILE_IMAGE,
                        contentType: core.CONTENT_TYPE_IMAGE
                    },
                    {
                        iconName: ICON_FILE_IMAGE,
                        contentType: core.CONTENT_TYPE_SVG
                    },
                    {
                        iconName: ICON_FILE_SOUND,
                        contentType: core.CONTENT_TYPE_AUDIO
                    },
                    {
                        iconName: ICON_FILE_VIDEO,
                        contentType: core.CONTENT_TYPE_VIDEO
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_SCRIPT
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_JAVASCRIPT
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_TYPESCRIPT
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_CSS
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_HTML
                    },
                    {
                        iconName: ICON_FILE_SCRIPT,
                        contentType: core.CONTENT_TYPE_XML
                    },
                    {
                        iconName: ICON_FILE_TEXT,
                        contentType: core.CONTENT_TYPE_TEXT
                    }
                ]));
        }
    }

    colibri.Platform.addPlugin(WebContentTypesPlugin.getInstance());
}