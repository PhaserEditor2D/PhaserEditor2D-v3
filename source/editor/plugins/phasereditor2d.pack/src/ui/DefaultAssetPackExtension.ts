namespace phasereditor2d.pack.ui {

    import controls = colibri.ui.controls;

    const DEFAULT_TYPES = [
        core.IMAGE_TYPE,
        core.SVG_TYPE,
        core.ATLAS_TYPE,
        core.ATLAS_XML_TYPE,
        core.UNITY_ATLAS_TYPE,
        core.MULTI_ATLAS_TYPE,
        core.SPRITESHEET_TYPE,
        core.ANIMATION_TYPE,
        core.ASEPRITE_TYPE,
        core.BITMAP_FONT_TYPE,
        core.TILEMAP_CSV_TYPE,
        core.TILEMAP_IMPACT_TYPE,
        core.TILEMAP_TILED_JSON_TYPE,
        core.SPINE_JSON_TYPE,
        core.SPINE_BINARY_TYPE,
        core.SPINE_ATLAS_TYPE,
        core.PLUGIN_TYPE,
        core.SCENE_FILE_TYPE,
        core.SCENE_PLUGIN_TYPE,
        core.SCRIPT_TYPE,
        core.SCRIPTS_TYPE,
        core.AUDIO_TYPE,
        core.AUDIO_SPRITE_TYPE,
        core.VIDEO_TYPE,
        core.TEXT_TYPE,
        core.CSS_TYPE,
        core.GLSL_TYPE,
        core.HTML_TYPE,
        core.HTML_TEXTURE_TYPE,
        core.BINARY_TYPE,
        core.JSON_TYPE,
        core.XML_TYPE
    ];

    const ASSET_PACK_TYPE_DISPLAY_NAME = {
        image: "Image",
        svg: "SVG",
        atlas: "Atlas",
        atlasXML: "Atlas XML",
        unityAtlas: "Unity Atlas",
        multiatlas: "Multiatlas",
        spritesheet: "Spritesheet",
        animation: "Animation",
        aseprite: "Aseprite",
        bitmapFont: "Bitmap Font",
        tilemapCSV: "Tilemap CSV",
        tilemapImpact: "Tilemap Impact",
        tilemapTiledJSON: "Tilemap Tiled JSON",
        spineJson: "Spine JSON",
        spineBinary: "Spine Binary",
        spineAtlas: "Spine Atlas",
        plugin: "Plugin",
        sceneFile: "Scene File",
        scenePlugin: "Scene Plugin",
        script: "Script",
        scripts: "Scripts (Predictable Order)",
        audio: "Audio",
        audioSprite: "Audio Sprite",
        video: "Video",
        text: "Text",
        css: "CSS",
        glsl: "GLSL",
        html: "HTML",
        htmlTexture: "HTML Texture",
        binary: "Binary",
        json: "JSON",
        xml: "XML"
    };

    export class DefaultAssetPackExtension extends AssetPackExtension {

        createAssetPackItem(type: string, data: any, pack: core.AssetPack): core.AssetPackItem {

            switch (type) {

                case core.IMAGE_TYPE:
                    return new core.ImageAssetPackItem(pack, data);

                case core.SVG_TYPE:
                    return new core.SvgAssetPackItem(pack, data);

                case core.ATLAS_TYPE:
                    return new core.AtlasAssetPackItem(pack, data);

                case core.ATLAS_XML_TYPE:
                    return new core.AtlasXMLAssetPackItem(pack, data);

                case core.UNITY_ATLAS_TYPE:
                    return new core.UnityAtlasAssetPackItem(pack, data);

                case core.MULTI_ATLAS_TYPE:
                    return new core.MultiatlasAssetPackItem(pack, data);

                case core.SPRITESHEET_TYPE:
                    return new core.SpritesheetAssetPackItem(pack, data);

                case core.ANIMATION_TYPE:
                    return new core.AnimationsAssetPackItem(pack, data);

                case core.ASEPRITE_TYPE:
                    return new core.AsepriteAssetPackItem(pack, data);

                case core.BITMAP_FONT_TYPE:
                    return new core.BitmapFontAssetPackItem(pack, data);

                case core.TILEMAP_CSV_TYPE:
                    return new core.TilemapCSVAssetPackItem(pack, data);

                case core.TILEMAP_IMPACT_TYPE:
                    return new core.TilemapImpactAssetPackItem(pack, data);

                case core.TILEMAP_TILED_JSON_TYPE:
                    return new core.TilemapTiledJSONAssetPackItem(pack, data);

                case core.SPINE_JSON_TYPE:
                    return new core.SpineJsonAssetPackItem(pack, data);

                case core.SPINE_BINARY_TYPE:
                    return new core.SpineBinaryAssetPackItem(pack, data);

                case core.SPINE_ATLAS_TYPE:
                    return new core.SpineAtlasAssetPackItem(pack, data);

                case core.PLUGIN_TYPE:
                    return new core.PluginAssetPackItem(pack, data);

                case core.SCENE_FILE_TYPE:
                    return new core.SceneFileAssetPackItem(pack, data);

                case core.SCENE_PLUGIN_TYPE:
                    return new core.ScenePluginAssetPackItem(pack, data);

                case core.SCRIPT_TYPE:
                    return new core.ScriptAssetPackItem(pack, data);

                case core.SCRIPTS_TYPE:
                    return new core.ScriptsAssetPackItem(pack, data);

                case core.AUDIO_TYPE:
                    return new core.AudioAssetPackItem(pack, data);

                case core.AUDIO_SPRITE_TYPE:
                    return new core.AudioSpriteAssetPackItem(pack, data);

                case core.VIDEO_TYPE:
                    return new core.VideoAssetPackItem(pack, data);

                case core.TEXT_TYPE:
                    return new core.TextAssetPackItem(pack, data);

                case core.CSS_TYPE:
                    return new core.CssAssetPackItem(pack, data);

                case core.GLSL_TYPE:
                    return new core.GlslAssetPackItem(pack, data);

                case core.HTML_TYPE:
                    return new core.HTMLAssetPackItem(pack, data);

                case core.HTML_TEXTURE_TYPE:
                    return new core.HTMLTextureAssetPackItem(pack, data);

                case core.BINARY_TYPE:
                    return new core.BinaryAssetPackItem(pack, data);

                case core.JSON_TYPE:
                    return new core.JSONAssetPackItem(pack, data);

                case core.XML_TYPE:
                    return new core.XMLAssetPackItem(pack, data);
            }

            return undefined;
        }

        createEditorPropertySections(page: controls.properties.PropertyPage): controls.properties.PropertySection<any>[] {

            const exts = AssetPackPlugin.getInstance().getPreviewPropertyProviderExtensions();

            return [

                new editor.properties.BlocksSection(page),

                new editor.properties.ItemSection(page),

                new editor.properties.ImageSection(page),

                new editor.properties.SVGSection(page),

                new editor.properties.AtlasSection(page),

                new editor.properties.AtlasXMLSection(page),

                new editor.properties.UnityAtlasSection(page),

                new editor.properties.MultiatlasSection(page),

                new editor.properties.SpritesheetURLSection(page),

                new editor.properties.SpritesheetFrameSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.AnimationsSection",
                    "Animations",
                    "URL",
                    "url",
                    core.contentTypes.CONTENT_TYPE_ANIMATIONS,
                    core.ANIMATION_TYPE),

                new editor.properties.AsepriteSection(page),

                new editor.properties.BitmapFontSection(page),

                new editor.properties.TilemapCSVSection(page),

                new editor.properties.TilemapImpactSection(page),

                new editor.properties.TilemapTiledJSONSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.SpineJsonSection",
                    "Spine JSON",
                    "URL",
                    "url",
                    core.contentTypes.CONTENT_TYPE_SPINE_JSON,
                    core.SPINE_JSON_TYPE),

                new editor.properties.PluginSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.SceneFileSection",
                    "Scene File",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                    core.SCENE_FILE_TYPE),

                new editor.properties.ScenePluginSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.ScriptSection",
                    "Script",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                    core.SCRIPT_TYPE),

                new editor.properties.ScriptsSection(page),

                new editor.properties.AudioSection(page),

                new editor.properties.AudioSpriteSection(page),

                new editor.properties.VideoSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.TextSection",
                    "Text",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_TEXT,
                    core.TEXT_TYPE),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.CSSSection",
                    "CSS",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_CSS,
                    core.CSS_TYPE),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.GLSLSection",
                    "GLSL",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_GLSL,
                    core.GLSL_TYPE),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.HTMLSection",
                    "HTML",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_HTML,
                    core.HTML_TYPE),

                new editor.properties.HTMLTextureSection(page),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.BinarySection",
                    "Binary",
                    "URL",
                    "url",
                    colibri.core.CONTENT_TYPE_ANY,
                    core.BINARY_TYPE),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.JSONSection",
                    "JSON",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_JSON,
                    core.JSON_TYPE),

                new editor.properties.SimpleURLSection(page,
                    "phasereditor2d.pack.ui.editor.properties.XMLSection",
                    "XML",
                    "URL",
                    "url",
                    webContentTypes.core.CONTENT_TYPE_XML,
                    core.XML_TYPE),

                // info sections

                new pack.ui.properties.AtlasFrameInfoSection(page),
                new pack.ui.properties.TilemapTiledSection(page),

                // preview sections

                new ui.properties.ImagePreviewSection(page),

                new ui.properties.ManyImagePreviewSection(page),

                new ui.properties.AnimationsPreviewSection(page),

                new ui.properties.AnimationPreviewSection(page),

                ...exts.flatMap(ext => ext.getSections(page))
            ];
        }

        getAssetPackItemTypes(): { type: string, displayName: string }[] {

            return DEFAULT_TYPES.map(type => ({
                type,
                displayName: ASSET_PACK_TYPE_DISPLAY_NAME[type]
            }));
        }

        getCellRenderer(element: any, layout: "grid" | "tree"): controls.viewers.ICellRenderer | undefined {

            if (element instanceof core.AssetPackItem) {

                const type = element.getType();

                switch (type) {

                    case core.IMAGE_TYPE:
                    case core.SVG_TYPE:

                        return new viewers.ImageAssetPackItemCellRenderer();

                    case core.MULTI_ATLAS_TYPE:
                    case core.ATLAS_TYPE:
                    case core.UNITY_ATLAS_TYPE:
                    case core.ATLAS_XML_TYPE:
                    case core.SPINE_ATLAS_TYPE: {

                        return new viewers.AtlasItemCellRenderer();
                    }

                    case core.SPRITESHEET_TYPE:

                        return new viewers.ImageFrameContainerIconCellRenderer();

                    case core.AUDIO_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_FILE_SOUND), layout);

                    case core.SCRIPT_TYPE:
                    case core.SCENE_FILE_TYPE:

                        return DefaultAssetPackExtension.getScriptUrlCellRenderer(element, layout);

                    case core.SCRIPTS_TYPE:

                        return new controls.viewers.FolderCellRenderer();

                    case core.SCENE_PLUGIN_TYPE:
                    case core.PLUGIN_TYPE:
                    case core.CSS_TYPE:
                    case core.GLSL_TYPE:
                    case core.XML_TYPE:
                    case core.HTML_TYPE:
                    case core.JSON_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_FILE_SCRIPT), layout);

                    case core.TEXT_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_FILE_TEXT), layout);

                    case core.HTML_TEXTURE_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_FILE_IMAGE), layout);

                    case core.BITMAP_FONT_TYPE:

                        return new viewers.BitmapFontAssetCellRenderer();

                    case core.VIDEO_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_FILE_VIDEO), layout);

                    case core.ANIMATION_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_ANIMATIONS), layout);

                    case core.TILEMAP_CSV_TYPE:
                    case core.TILEMAP_IMPACT_TYPE:
                    case core.TILEMAP_TILED_JSON_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_TILEMAP), layout);

                    case core.SPINE_JSON_TYPE:
                    case core.SPINE_BINARY_TYPE:

                        return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_SPINE), layout);

                    default:
                        break;
                }

            } else if (element instanceof controls.ImageFrame) {

                return new controls.viewers.ImageCellRenderer();

            } else if (element instanceof core.AnimationConfigInPackItem) {

                // return DefaultAssetPackExtension.getIconRenderer(resources.getIcon(resources.ICON_ANIMATIONS), layout);

                return new viewers.AnimationConfigCellRenderer();
            }

            return undefined;
        }

        static getScriptUrlCellRenderer(item: core.ScriptAssetPackItem, layout: "grid" | "tree") {

            const file = item.getFileFromAssetUrl(item.getData().url);

            if (file) {

                const sceneFile = file.getParent().getFile(file.getNameWithoutExtension() + ".scene");

                if (sceneFile) {

                    return new viewers.SceneScriptCellRenderer(layout);
                }
            }

            return this.getIconRenderer(resources.getIcon(resources.ICON_FILE_SCRIPT), layout);
        }

        static getIconRenderer(icon: controls.IImage, layout: "grid" | "tree") {

            if (layout === "grid") {

                return new controls.viewers.IconGridCellRenderer(icon);
            }

            return new controls.viewers.IconImageCellRenderer(icon);
        }

        createImporters(): importers.Importer[] {

            return [

                new importers.AtlasImporter(),

                new importers.MultiatlasImporter(),

                new importers.AtlasXMLImporter(),

                new importers.UnityAtlasImporter(),

                new importers.SpineImporter(core.contentTypes.CONTENT_TYPE_SPINE_JSON, core.SPINE_JSON_TYPE),

                new importers.SpineImporter(core.contentTypes.CONTENT_TYPE_SPINE_BINARY, core.SPINE_BINARY_TYPE),

                new importers.SpineAtlasImporter(),

                new importers.BitmapFontImporter(),

                new importers.AsepriteImporter(),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_IMAGE, core.IMAGE_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_SVG, core.IMAGE_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_SVG, core.SVG_TYPE, false, {
                    svgConfig: {
                        width: 0,
                        height: 0,
                        scale: 0
                    }
                }),

                new importers.SpritesheetImporter(),

                new importers.SingleFileImporter(core.contentTypes.CONTENT_TYPE_ANIMATIONS, core.ANIMATION_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_CSV, core.TILEMAP_CSV_TYPE),

                new importers.SingleFileImporter(core.contentTypes.CONTENT_TYPE_TILEMAP_IMPACT, core.TILEMAP_IMPACT_TYPE),

                new importers.SingleFileImporter(core.contentTypes.CONTENT_TYPE_TILEMAP_TILED_JSON,
                    core.TILEMAP_TILED_JSON_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.PLUGIN_TYPE, false, {
                    start: false,
                    mapping: ""
                }),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCENE_FILE_TYPE),

                new importers.ScenePluginImporter(),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JAVASCRIPT, core.SCRIPT_TYPE),

                new importers.ScriptsImporter(),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_AUDIO, core.AUDIO_TYPE, true),

                new importers.AudioSpriteImporter(),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_VIDEO, core.VIDEO_TYPE, true),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_TEXT, core.TEXT_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_CSS, core.CSS_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_HTML, core.HTML_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_HTML, core.HTML_TEXTURE_TYPE, false, {
                    width: 512,
                    height: 512
                }),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_GLSL, core.GLSL_TYPE),

                new importers.SingleFileImporter(colibri.core.CONTENT_TYPE_ANY, core.BINARY_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_JSON, core.JSON_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_XML, core.XML_TYPE),

                new importers.SingleFileImporter(webContentTypes.core.CONTENT_TYPE_GLSL, core.GLSL_TYPE),
            ];
        }
    }
}