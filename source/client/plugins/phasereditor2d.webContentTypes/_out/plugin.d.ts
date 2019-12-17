declare namespace phasereditor2d.webContentTypes {
    const ICON_FILE_FONT = "file-font";
    const ICON_FILE_IMAGE = "file-image";
    const ICON_FILE_VIDEO = "file-movie";
    const ICON_FILE_SCRIPT = "file-script";
    const ICON_FILE_SOUND = "file-sound";
    const ICON_FILE_TEXT = "file-text";
    class WebContentTypesPlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): WebContentTypesPlugin;
        constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
    }
}
declare namespace phasereditor2d.webContentTypes.core {
    import io = colibri.core.io;
    class ExtensionContentTypeResolver extends colibri.core.ContentTypeResolver {
        private _map;
        constructor(id: string, defs: string[][]);
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.webContentTypes.core {
    const CONTENT_TYPE_IMAGE = "image";
    const CONTENT_TYPE_SVG = "svg";
    const CONTENT_TYPE_AUDIO = "audio";
    const CONTENT_TYPE_VIDEO = "video";
    const CONTENT_TYPE_SCRIPT = "script";
    const CONTENT_TYPE_TEXT = "text";
    const CONTENT_TYPE_CSV = "csv";
    const CONTENT_TYPE_JAVASCRIPT = "javascript";
    const CONTENT_TYPE_TYPESCRIPT = "typescript";
    const CONTENT_TYPE_HTML = "html";
    const CONTENT_TYPE_CSS = "css";
    const CONTENT_TYPE_JSON = "json";
    const CONTENT_TYPE_XML = "xml";
    const CONTENT_TYPE_GLSL = "glsl";
    class DefaultExtensionTypeResolver extends ExtensionContentTypeResolver {
        constructor();
    }
}
//# sourceMappingURL=plugin.d.ts.map