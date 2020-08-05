
namespace phasereditor2d.webContentTypes.core {

    export const CONTENT_TYPE_IMAGE = "image";
    export const CONTENT_TYPE_SVG = "svg";
    export const CONTENT_TYPE_AUDIO = "audio";
    export const CONTENT_TYPE_VIDEO = "video";
    export const CONTENT_TYPE_SCRIPT = "script";
    export const CONTENT_TYPE_TEXT = "text";
    export const CONTENT_TYPE_CSV = "csv";
    export const CONTENT_TYPE_JAVASCRIPT = "javascript";
    export const CONTENT_TYPE_TYPESCRIPT = "typescript";
    export const CONTENT_TYPE_HTML = "html";
    export const CONTENT_TYPE_CSS = "css";
    export const CONTENT_TYPE_JSON = "json";
    export const CONTENT_TYPE_XML = "xml";
    export const CONTENT_TYPE_GLSL = "glsl";

    export class DefaultExtensionTypeResolver extends colibri.core.ContentTypeResolverByExtension {
        constructor() {
            super("phasereditor2d.files.core.DefaultExtensionTypeResolver", [
                ["png", CONTENT_TYPE_IMAGE],
                ["jpg", CONTENT_TYPE_IMAGE],
                ["bmp", CONTENT_TYPE_IMAGE],
                ["gif", CONTENT_TYPE_IMAGE],
                ["webp", CONTENT_TYPE_IMAGE],

                ["svg", CONTENT_TYPE_SVG],

                ["mp3", CONTENT_TYPE_AUDIO],
                ["wav", CONTENT_TYPE_AUDIO],
                ["ogg", CONTENT_TYPE_AUDIO],

                ["mp4", CONTENT_TYPE_VIDEO],
                ["ogv", CONTENT_TYPE_VIDEO],
                ["mp4", CONTENT_TYPE_VIDEO],
                ["webm", CONTENT_TYPE_VIDEO],

                ["js", CONTENT_TYPE_JAVASCRIPT],
                ["ts", CONTENT_TYPE_TYPESCRIPT],
                ["html", CONTENT_TYPE_HTML],
                ["css", CONTENT_TYPE_CSS],
                ["json", CONTENT_TYPE_JSON],
                ["xml", CONTENT_TYPE_XML],
                ["glsl", CONTENT_TYPE_GLSL],

                ["txt", CONTENT_TYPE_TEXT],
                ["md", CONTENT_TYPE_TEXT],

                ["csv", CONTENT_TYPE_CSV]
            ]);

        }
    }

}