namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteSizeTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.TileSpriteResizeTool";

        constructor() {
            super({
                id: TileSpriteSizeTool.ID,
                command: editor.commands.CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT,
            }, TileSpriteComponent.width, TileSpriteComponent.height);

            this.addItems(
                new TileSpriteSizeToolItem(1, 0.5),
                new TileSpriteSizeToolItem(1, 1),
                new TileSpriteSizeToolItem(0.5, 1),
            );
        }

        canEdit(obj: unknown) {

            return obj instanceof TileSprite || obj instanceof Rectangle;
        }
    }
}