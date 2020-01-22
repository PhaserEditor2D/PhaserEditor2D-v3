namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class TileSpriteCodeDOMBuilder extends BaseImageCodeDOMBuilder {

        constructor() {
            super("tileSprite");
        }

        protected addArgsToObjectFactoryMethodCallDOM(call: code.MethodCallCodeDOM, obj: ITransformLikeObject) {

            const tileSprite = obj as TileSprite;

            call.argFloat(tileSprite.x);
            call.argFloat(tileSprite.y);

            const support = obj.getEditorSupport();

            let width = tileSprite.width;
            let height = tileSprite.height;

            if (support.isPrefabInstance()) {

                const prefabSerializer = support.getPrefabSerializer();

                if (prefabSerializer) {

                    if (!prefabSerializer.isUnlocked(TileSpriteComponent.width.name)) {
                        width = undefined;
                    }

                    if (!prefabSerializer.isUnlocked(TileSpriteComponent.height.name)) {
                        height = undefined;
                    }

                } else {

                    throw new Error(`Cannot find prefab with id ${support.getPrefabId()}.`);
                }
            }

            call.argFloat(width);
            call.argFloat(height);

            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);
        }
    }
}