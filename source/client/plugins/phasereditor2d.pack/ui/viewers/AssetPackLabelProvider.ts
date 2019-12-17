namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    const ASSET_PACK_TYPE_DISPLAY_NAME = {
        image: "Image",
        svg: "SVG",
        atlas: "Atlas",
        atlasXML: "Atlas XML",
        unityAtlas: "Unity Atlas",
        multiatlas: "Multiatlas",
        spritesheet: "Spritesheet",
        animations: "Animations",
        bitmapFont: "Bitmap Font",
        tilemapCSV: "Tilemap CSV",
        tilemapImpact: "Tilemap Impact",
        tilemapTiledJSON: "Tilemap Tiled JSON",
        plugin: "Plugin",
        sceneFile: "Scene File",
        scenePlugin: "Scene Plugin",
        script: "Script",
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

    export class AssetPackLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {
            
            if (obj instanceof core.AssetPack) {
                return obj.getFile().getName();
            }

            if (obj instanceof core.AssetPackItem) {
                return obj.getKey();
            }

            if (obj instanceof controls.ImageFrame) {
                return obj.getName();
            }

            if (typeof (obj) === "string") {
                
                if (obj in ASSET_PACK_TYPE_DISPLAY_NAME) {
                    return ASSET_PACK_TYPE_DISPLAY_NAME[obj];
                }

                return obj;
            }

            return "";
        }

    }

}