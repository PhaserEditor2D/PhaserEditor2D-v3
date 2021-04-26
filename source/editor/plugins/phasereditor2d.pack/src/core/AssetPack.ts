namespace phasereditor2d.pack.core {

    import ide = colibri.ui.ide;
    import core = colibri.core;
    import io = colibri.core.io;

    export const IMAGE_TYPE = "image";
    export const ATLAS_TYPE = "atlas";
    export const ATLAS_XML_TYPE = "atlasXML";
    export const UNITY_ATLAS_TYPE = "unityAtlas";
    export const MULTI_ATLAS_TYPE = "multiatlas";
    export const SPRITESHEET_TYPE = "spritesheet";
    export const ANIMATION_TYPE = "animation";
    export const AUDIO_TYPE = "audio";
    export const AUDIO_SPRITE_TYPE = "audioSprite";
    export const BINARY_TYPE = "binary";
    export const BITMAP_FONT_TYPE = "bitmapFont";
    export const CSS_TYPE = "css";
    export const GLSL_TYPE = "glsl";
    export const HTML_TYPE = "html";
    export const HTML_TEXTURE_TYPE = "htmlTexture";
    export const JSON_TYPE = "json";
    export const PLUGIN_TYPE = "plugin";
    export const SCENE_FILE_TYPE = "sceneFile";
    export const SCENE_PLUGIN_TYPE = "scenePlugin";
    export const SCRIPT_TYPE = "script";
    export const SCRIPTS_TYPE = "scripts";
    export const SVG_TYPE = "svg";
    export const TEXT_TYPE = "text";
    export const TILEMAP_CSV_TYPE = "tilemapCSV";
    export const TILEMAP_IMPACT_TYPE = "tilemapImpact";
    export const TILEMAP_TILED_JSON_TYPE = "tilemapTiledJSON";
    export const VIDEO_TYPE = "video";
    export const XML_TYPE = "xml";

    export const TYPES = [
        IMAGE_TYPE,
        SVG_TYPE,
        ATLAS_TYPE,
        ATLAS_XML_TYPE,
        UNITY_ATLAS_TYPE,
        MULTI_ATLAS_TYPE,
        SPRITESHEET_TYPE,
        ANIMATION_TYPE,
        BITMAP_FONT_TYPE,
        TILEMAP_CSV_TYPE,
        TILEMAP_IMPACT_TYPE,
        TILEMAP_TILED_JSON_TYPE,
        PLUGIN_TYPE,
        SCENE_FILE_TYPE,
        SCENE_PLUGIN_TYPE,
        SCRIPT_TYPE,
        SCRIPTS_TYPE,
        AUDIO_TYPE,
        AUDIO_SPRITE_TYPE,
        VIDEO_TYPE,
        TEXT_TYPE,
        CSS_TYPE,
        GLSL_TYPE,
        HTML_TYPE,
        HTML_TEXTURE_TYPE,
        BINARY_TYPE,
        JSON_TYPE,
        XML_TYPE
    ];

    export const TYPES_SET = new Set(TYPES);

    export class AssetPack {

        private _file: core.io.FilePath;
        private _items: AssetPackItem[];
        private _showAllFilesInBlocks: boolean;

        constructor(file: core.io.FilePath, content: string) {
            this._file = file;
            this._items = [];

            if (content) {

                try {

                    const data = JSON.parse(content);

                    this.fromJSON(data);

                    if (data.meta) {

                        this._showAllFilesInBlocks = data.meta.showAllFilesInBlocks || false;
                    }

                } catch (e) {

                    console.error(e);
                    alert(e.message);
                }
            }
        }

        isShowAllFilesInBlocks() {

            return this._showAllFilesInBlocks;
        }

        setShowAllFilesInBlocks(showAllFilesInBlocks) {

            this._showAllFilesInBlocks = showAllFilesInBlocks;
        }

        computeUsedFiles(files: Set<io.FilePath> = new Set()) {

            files.add(this._file);

            for (const item of this.getItems()) {

                item.computeUsedFiles(files);
            }

            return files;
        }

        toJSON(): any {
            return {
                section1: {
                    files: this._items.map(item => item.getData())
                },
                meta: {
                    app: "Phaser Editor 2D - Asset Pack Editor",
                    contentType: pack.core.contentTypes.CONTENT_TYPE_ASSET_PACK,
                    url: "https://phasereditor2d.com",
                    version: 2,
                    showAllFilesInBlocks: this._showAllFilesInBlocks
                }
            };
        }

        fromJSON(data: any) {

            this._items = [];

            for (const sectionId in data) {

                if (data.hasOwnProperty(sectionId)) {

                    const sectionData = data[sectionId];

                    const filesData = sectionData["files"];

                    if (filesData) {

                        for (const fileData of filesData) {

                            const item = this.createPackItem(fileData);
                            this._items.push(item);
                        }
                    }
                }
            }

            this.sortItems();
        }

        private sortItems() {

            this._items.sort((a, b) => a.getKey().localeCompare(b.getKey()));
        }

        createPackItem(data: any) {

            const type = data.type;

            switch (type) {
                case IMAGE_TYPE:
                    return new ImageAssetPackItem(this, data);
                case SVG_TYPE:
                    return new SvgAssetPackItem(this, data);
                case ATLAS_TYPE:
                    return new AtlasAssetPackItem(this, data);
                case ATLAS_XML_TYPE:
                    return new AtlasXMLAssetPackItem(this, data);
                case UNITY_ATLAS_TYPE:
                    return new UnityAtlasAssetPackItem(this, data);
                case MULTI_ATLAS_TYPE:
                    return new MultiatlasAssetPackItem(this, data);
                case SPRITESHEET_TYPE:
                    return new SpritesheetAssetPackItem(this, data);
                case ANIMATION_TYPE:
                    return new AnimationsAssetPackItem(this, data);
                case BITMAP_FONT_TYPE:
                    return new BitmapFontAssetPackItem(this, data);
                case TILEMAP_CSV_TYPE:
                    return new TilemapCSVAssetPackItem(this, data);
                case TILEMAP_IMPACT_TYPE:
                    return new TilemapImpactAssetPackItem(this, data);
                case TILEMAP_TILED_JSON_TYPE:
                    return new TilemapTiledJSONAssetPackItem(this, data);
                case PLUGIN_TYPE:
                    return new PluginAssetPackItem(this, data);
                case SCENE_FILE_TYPE:
                    return new SceneFileAssetPackItem(this, data);
                case SCENE_PLUGIN_TYPE:
                    return new ScenePluginAssetPackItem(this, data);
                case SCRIPT_TYPE:
                    return new ScriptAssetPackItem(this, data);
                case SCRIPTS_TYPE:
                    return new ScriptsAssetPackItem(this, data);
                case AUDIO_TYPE:
                    return new AudioAssetPackItem(this, data);
                case AUDIO_SPRITE_TYPE:
                    return new AudioSpriteAssetPackItem(this, data);
                case VIDEO_TYPE:
                    return new VideoAssetPackItem(this, data);
                case TEXT_TYPE:
                    return new TextAssetPackItem(this, data);
                case CSS_TYPE:
                    return new CssAssetPackItem(this, data);
                case GLSL_TYPE:
                    return new GlslAssetPackItem(this, data);
                case HTML_TYPE:
                    return new HTMLAssetPackItem(this, data);
                case HTML_TEXTURE_TYPE:
                    return new HTMLTextureAssetPackItem(this, data);
                case BINARY_TYPE:
                    return new BinaryAssetPackItem(this, data);
                case JSON_TYPE:
                    return new JSONAssetPackItem(this, data);
                case XML_TYPE:
                    return new XMLAssetPackItem(this, data);
            }

            throw new Error(`Unknown file type ${type}`);
        }

        static async createFromFile(file: core.io.FilePath) {

            const content = await ide.FileUtils.preloadAndGetFileString(file);

            return new AssetPack(file, content);
        }

        getItems() {
            return this._items;
        }

        addItem(item: AssetPackItem) {

            this._items.push(item);

            this.sortItems();
        }

        deleteItem(item: AssetPackItem) {

            const i = this._items.indexOf(item);

            if (i >= 0) {
                this._items.splice(i, 1);
            }
        }

        getFile() {
            return this._file;
        }

        getUrlFromAssetFile(file: io.FilePath) {

            return AssetPackUtils.getUrlFromAssetFile(this, file);
        }
    }
}