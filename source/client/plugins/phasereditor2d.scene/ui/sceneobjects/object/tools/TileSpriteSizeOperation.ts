namespace phasereditor2d.scene.ui.sceneobjects {

    export class TileSpriteSizeOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: any): { x: number; y: number; } {

            return TileSpriteSizeToolItem.getInitialSize(obj);
        }

        getFinalValue(obj: any): { x: number; y: number; } {

            const sprite = obj as TileSprite;

            return { x: sprite.width, y: sprite.height };
        }

        setValue(obj: any, value: { x: number; y: number; }) {

            const sprite = obj as TileSprite;

            sprite.setSize(value.x, value.y);
        }
    }
}