var phasereditor2d;
(function (phasereditor2d) {
    var webContentTypes;
    (function (webContentTypes) {
        class WebContentTypesPlugin extends colibri.Plugin {
            static _instance;
            static getInstance() {
                if (!this._instance) {
                    this._instance = new WebContentTypesPlugin();
                }
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.webContentTypes");
            }
            registerExtensions(reg) {
                // content types
                reg.addExtension(new colibri.core.ContentTypeExtension([new webContentTypes.core.DefaultExtensionTypeResolver()], 1000));
                // content type icons
                reg.addExtension(colibri.ui.ide.ContentTypeIconExtension.withPluginIcons(phasereditor2d.resources.ResourcesPlugin.getInstance(), [
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_IMAGE,
                        contentType: webContentTypes.core.CONTENT_TYPE_IMAGE
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_IMAGE,
                        contentType: webContentTypes.core.CONTENT_TYPE_SVG
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SOUND,
                        contentType: webContentTypes.core.CONTENT_TYPE_AUDIO
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_VIDEO,
                        contentType: webContentTypes.core.CONTENT_TYPE_VIDEO
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_SCRIPT
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_JAVASCRIPT
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_TYPESCRIPT
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_CSS
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_HTML
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_XML
                    },
                    {
                        iconName: phasereditor2d.resources.ICON_FILE_TEXT,
                        contentType: webContentTypes.core.CONTENT_TYPE_TEXT
                    }
                ]));
            }
        }
        webContentTypes.WebContentTypesPlugin = WebContentTypesPlugin;
        colibri.Platform.addPlugin(WebContentTypesPlugin.getInstance());
    })(webContentTypes = phasereditor2d.webContentTypes || (phasereditor2d.webContentTypes = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var webContentTypes;
    (function (webContentTypes) {
        var core;
        (function (core) {
            core.CONTENT_TYPE_IMAGE = "image";
            core.CONTENT_TYPE_SVG = "svg";
            core.CONTENT_TYPE_AUDIO = "audio";
            core.CONTENT_TYPE_VIDEO = "video";
            core.CONTENT_TYPE_SCRIPT = "script";
            core.CONTENT_TYPE_TEXT = "text";
            core.CONTENT_TYPE_CSV = "csv";
            core.CONTENT_TYPE_JAVASCRIPT = "javascript";
            core.CONTENT_TYPE_TYPESCRIPT = "typescript";
            core.CONTENT_TYPE_HTML = "html";
            core.CONTENT_TYPE_CSS = "css";
            core.CONTENT_TYPE_JSON = "json";
            core.CONTENT_TYPE_XML = "xml";
            core.CONTENT_TYPE_GLSL = "glsl";
            class DefaultExtensionTypeResolver extends colibri.core.ContentTypeResolverByExtension {
                constructor() {
                    super("phasereditor2d.files.core.DefaultExtensionTypeResolver", [
                        ["png", core.CONTENT_TYPE_IMAGE],
                        ["jpg", core.CONTENT_TYPE_IMAGE],
                        ["bmp", core.CONTENT_TYPE_IMAGE],
                        ["gif", core.CONTENT_TYPE_IMAGE],
                        ["webp", core.CONTENT_TYPE_IMAGE],
                        ["svg", core.CONTENT_TYPE_SVG],
                        ["mp3", core.CONTENT_TYPE_AUDIO],
                        ["wav", core.CONTENT_TYPE_AUDIO],
                        ["ogg", core.CONTENT_TYPE_AUDIO],
                        ["mp4", core.CONTENT_TYPE_VIDEO],
                        ["ogv", core.CONTENT_TYPE_VIDEO],
                        ["mp4", core.CONTENT_TYPE_VIDEO],
                        ["webm", core.CONTENT_TYPE_VIDEO],
                        ["js", core.CONTENT_TYPE_JAVASCRIPT],
                        ["ts", core.CONTENT_TYPE_TYPESCRIPT],
                        ["html", core.CONTENT_TYPE_HTML],
                        ["css", core.CONTENT_TYPE_CSS],
                        ["json", core.CONTENT_TYPE_JSON],
                        ["xml", core.CONTENT_TYPE_XML],
                        ["glsl", core.CONTENT_TYPE_GLSL],
                        ["txt", core.CONTENT_TYPE_TEXT],
                        ["md", core.CONTENT_TYPE_TEXT],
                        ["csv", core.CONTENT_TYPE_CSV]
                    ]);
                }
            }
            core.DefaultExtensionTypeResolver = DefaultExtensionTypeResolver;
        })(core = webContentTypes.core || (webContentTypes.core = {}));
    })(webContentTypes = phasereditor2d.webContentTypes || (phasereditor2d.webContentTypes = {}));
})(phasereditor2d || (phasereditor2d = {}));
