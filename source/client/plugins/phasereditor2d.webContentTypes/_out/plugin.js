var phasereditor2d;
(function (phasereditor2d) {
    var webContentTypes;
    (function (webContentTypes) {
        webContentTypes.ICON_FILE_FONT = "file-font";
        webContentTypes.ICON_FILE_IMAGE = "file-image";
        webContentTypes.ICON_FILE_VIDEO = "file-movie";
        webContentTypes.ICON_FILE_SCRIPT = "file-script";
        webContentTypes.ICON_FILE_SOUND = "file-sound";
        webContentTypes.ICON_FILE_TEXT = "file-text";
        class WebContentTypesPlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.webContentTypes");
            }
            static getInstance() {
                if (!this._instance) {
                    this._instance = new WebContentTypesPlugin();
                }
                return this._instance;
            }
            registerExtensions(reg) {
                // content types
                reg.addExtension(new colibri.core.ContentTypeExtension([new webContentTypes.core.DefaultExtensionTypeResolver()], 1000));
                // icons loader
                reg.addExtension(colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    webContentTypes.ICON_FILE_IMAGE,
                    webContentTypes.ICON_FILE_SOUND,
                    webContentTypes.ICON_FILE_VIDEO,
                    webContentTypes.ICON_FILE_SCRIPT,
                    webContentTypes.ICON_FILE_TEXT,
                    webContentTypes.ICON_FILE_FONT
                ]));
                // content type resolvers
                // content type icons
                reg.addExtension(colibri.ui.ide.ContentTypeIconExtension.withPluginIcons(this, [
                    {
                        iconName: webContentTypes.ICON_FILE_IMAGE,
                        contentType: webContentTypes.core.CONTENT_TYPE_IMAGE
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_IMAGE,
                        contentType: webContentTypes.core.CONTENT_TYPE_SVG
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SOUND,
                        contentType: webContentTypes.core.CONTENT_TYPE_AUDIO
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_VIDEO,
                        contentType: webContentTypes.core.CONTENT_TYPE_VIDEO
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_SCRIPT
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_JAVASCRIPT
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_TYPESCRIPT
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_CSS
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_HTML
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_SCRIPT,
                        contentType: webContentTypes.core.CONTENT_TYPE_XML
                    },
                    {
                        iconName: webContentTypes.ICON_FILE_TEXT,
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
            class ExtensionContentTypeResolver extends colibri.core.ContentTypeResolver {
                constructor(id, defs) {
                    super(id);
                    this._map = new Map();
                    for (const def of defs) {
                        this._map.set(def[0].toUpperCase(), def[1]);
                    }
                }
                computeContentType(file) {
                    const ext = file.getExtension().toUpperCase();
                    if (this._map.has(ext)) {
                        return Promise.resolve(this._map.get(ext));
                    }
                    return Promise.resolve(colibri.core.CONTENT_TYPE_ANY);
                }
            }
            core.ExtensionContentTypeResolver = ExtensionContentTypeResolver;
        })(core = webContentTypes.core || (webContentTypes.core = {}));
    })(webContentTypes = phasereditor2d.webContentTypes || (phasereditor2d.webContentTypes = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./ExtensionContentTypeResolver.ts" />
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
            class DefaultExtensionTypeResolver extends core.ExtensionContentTypeResolver {
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
                        ["ts", core.CONTENT_TYPE_SCRIPT],
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
