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

                this._list = AssetPackPlugin.getInstance()
                    .getExtensions().flatMap(ext => ext.createImporters());
            }

            return this._list;
        }

        static getImporter(type: string) {
            
            return this.getAll().find(i => i.getType() === type);
        }
    }
}