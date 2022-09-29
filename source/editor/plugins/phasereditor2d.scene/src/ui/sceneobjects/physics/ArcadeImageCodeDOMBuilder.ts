namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class ArcadeObjectCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor(arcadeObjectType: "image"|"sprite") {
            super(arcadeObjectType, "physics.add");
        }

        buildPrefabExtraTypeScriptDefinitionsCodeDOM(args: IBuildPrefabExtraTypeScriptDefinitionsCodeDOMArgs): void {
         
            const obj = args.prefabObj;

            const isStatic = ArcadeComponent.isStaticBody(obj as any);
            const type = isStatic? "StaticBody" : "Body";

            const src = `export default interface ${args.clsName} { body: Phaser.Physics.Arcade.${type} }`;

            args.unit.getTypeScriptExtraDefs().push(new code.RawCodeDOM(src));
        }

        getFactoryMethodName(obj: ArcadeImage): string {

            const defaultFactory = super.getFactoryMethodName(obj);

            if (ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.DYNAMIC_BODY) {

                return defaultFactory;
            }

            if (defaultFactory === "image") {

                return "staticImage";
            }

            return "staticSprite";
        }
    }
}