namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TilemapLayerCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        private _factoryMethod: string;

        constructor(factoryMethod: string) {
            super();

            this._factoryMethod = factoryMethod;
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const tilemapLayer = args.obj as (TilemapLayer);

            const tilesets = TilemapLayer.scanTilesets(tilemapLayer);
            const tilesetArray = "[" + tilesets.map(t => code.CodeDOM.quote(t.name)).join(",") + "]";

            const tilemap = tilemapLayer.tilemap as Tilemap;

            const tilemapVarName = code.formatToValidVarName(tilemap.getEditorSupport().getLabel());

            const call = new code.MethodCallCodeDOM(this._factoryMethod, tilemapVarName);

            call.argLiteral(tilemapLayer.layer.name);
            call.arg(tilesetArray);
            call.argInt(tilemapLayer.x);
            call.argInt(tilemapLayer.y);
            call.setNonNullAssertion(true);

            return call;
        }

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {
            throw new Error("Not supported");
        }

        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {
            throw new Error("Not supported");
        }

        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {
            throw new Error("Not supported");
        }
    }
}