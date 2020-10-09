namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TilemapLayerCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        private _factoryMethod: string;

        constructor(factoryMethod: string) {
            super();

            this._factoryMethod = factoryMethod;
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const tilemapLayer = args.obj as (StaticTilemapLayer | DynamicTilemapLayer);

            const tilemap = tilemapLayer.tilemap as Tilemap;

            const tilemapVarName = code.formatToValidVarName(tilemap.getEditorSupport().getLabel());

            const call = new code.MethodCallCodeDOM(this._factoryMethod, tilemapVarName);

            call.argLiteral(tilemapLayer.layer.name);
            call.arg(tilemapVarName + ".tilesets");
            call.argInt(tilemapLayer.x);
            call.argInt(tilemapLayer.y);

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