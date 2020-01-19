namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScaleOperation extends editor.tools.SceneToolOperation<{ x: number, y: number }> {

        getInitialValue(obj: any): { x: number; y: number; } {

            return ScaleToolItem.getInitialScale(obj);
        }

        getFinalValue(obj: any): { x: number; y: number; } {

            const sprite = obj as Phaser.GameObjects.Sprite;

            return { x: sprite.scaleX, y: sprite.scaleY };
        }

        setValue(obj: any, value: { x: number; y: number; }) {

            const sprite = obj as Phaser.GameObjects.Sprite;

            sprite.setScale(value.x, value.y);
        }
    }
}