/// <reference path="./MultiatlasImporter.ts" />
/// <reference path="./AtlasXMLImporter.ts" />
/// <reference path="./UnityAtlasImporter.ts" />
/// <reference path="./SingleFileImporter.ts" />
/// <reference path="./SpritesheetImporter.ts" />
/// <reference path="./BitmapFontImporter.ts" />
/// <reference path="../../core/contentTypes/TilemapImpactContentTypeResolver.ts" />
/// <reference path="../../core/contentTypes/TilemapTiledJSONContentTypeResolver.ts" />
/// <reference path="./AudioSpriteImporter.ts" />
/// <reference path="./ScenePluginImporter.ts" />

namespace phasereditor2d.pack.ui.importers {

    export class Importers {

        private static _list: Importer[];

        static getAll() {

            if (!this._list) {

                this._list = [

                    new AtlasImporter(),

                    new MultiatlasImporter(),

                    new AtlasXMLImporter(),

                    new UnityAtlasImporter(),

                    new BitmapFontImporter(),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_IMAGE, core.IMAGE_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_SVG, core.IMAGE_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_SVG, core.SVG_TYPE, false, {
                        svgConfig: {
                            width: 0,
                            height: 0,
                            scale: 0
                        }
                    }),
                    new SpritesheetImporter(),

                    new SingleFileImporter(core.contentTypes.CONTENT_TYPE_ANIMATIONS, core.ANIMATION_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_CSV, core.TILEMAP_CSV_TYPE),

                    new SingleFileImporter(core.contentTypes.CONTENT_TYPE_TILEMAP_IMPACT, core.TILEMAP_IMPACT_TYPE),

                    new SingleFileImporter(core.contentTypes.CONTENT_TYPE_TILEMAP_TILED_JSON,
                        core.TILEMAP_TILED_JSON_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.PLUGIN_TYPE, false, {
                        start: false,
                        mapping: ""
                    }),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCENE_FILE_TYPE),

                    new ScenePluginImporter(),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCRIPT_TYPE),

                    new ScriptsImporter(),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_AUDIO, core.AUDIO_TYPE, true),

                    new AudioSpriteImporter(),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_VIDEO, core.VIDEO_TYPE, true),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_TEXT, core.TEXT_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_CSS, core.CSS_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_HTML, core.HTML_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_HTML, core.HTML_TEXTURE_TYPE, false, {
                        width: 512,
                        height: 512
                    }),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_GLSL, core.GLSL_TYPE),

                    new SingleFileImporter(colibri.core.CONTENT_TYPE_ANY, core.BINARY_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JSON, core.JSON_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_XML, core.XML_TYPE),

                    new SingleFileImporter(webContentTypes.core.CONTENT_TYPE_GLSL, core.GLSL_TYPE),
                ];
            }

            return this._list;
        }

        static getImporter(type: string) {
            return this.getAll().find(i => i.getType() === type);
        }
    }
}