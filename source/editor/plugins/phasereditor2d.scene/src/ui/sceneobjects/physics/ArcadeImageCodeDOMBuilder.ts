namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ArcadeImageCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("image", "physics.add");
        }

        buildPrefabExtraTypeScriptDefinitionsCodeDOM(args: IBuildPrefabExtraTypeScriptDefinitionsCodeDOMArgs): void {
         
            const obj = args.prefabObj;

            const isStatic = ArcadeComponent.isStaticBody(obj as any);
            const type = isStatic? "StaticBody" : "Body";

            const src = `export default interface ${args.clsName} { body: Phaser.Physics.Arcade.${type} }`;

            args.unit.getTypeScriptExtraDefs().push(new code.RawCodeDOM(src));
        }

        getFactoryMethodName(obj: ArcadeImage): string {

            if (ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.DYNAMIC_BODY) {

                return "image";
            }

            return "staticImage";
        }
    }
}