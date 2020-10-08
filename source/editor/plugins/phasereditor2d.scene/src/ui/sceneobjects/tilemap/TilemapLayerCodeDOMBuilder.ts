namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TilemapLayerCodeDOMBuilder extends GameObjectCodeDOMBuilder {

        buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM {

            const tilemapLayer = args.obj as TilemapLayer;

            const tilemap = tilemapLayer.tilemap as Tilemap;

            const tilemapVarName = code.formatToValidVarName(tilemap.getEditorSupport().getLabel());

            const call = new code.MethodCallCodeDOM("createStaticLayer", tilemapVarName);

            call.argLiteral(tilemapLayer.layer.name);
            call.arg(tilemapVarName + ".tilesets");

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