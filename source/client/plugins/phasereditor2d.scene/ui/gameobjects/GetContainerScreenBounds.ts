namespace phasereditor2d.scene.ui.gameobjects {

    export function getContainerScreenBounds(container: EditorContainer, camera: Phaser.Cameras.Scene2D.Camera) {

        if (container.list.length === 0) {
            return [];
        }

        const minPoint = new Phaser.Math.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
        const maxPoint = new Phaser.Math.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

        for (const obj of container.list) {
            
            const bounds = obj.getScreenBounds(camera);

            for (const point of bounds) {
                minPoint.x = Math.min(minPoint.x, point.x);
                minPoint.y = Math.min(minPoint.y, point.y);
                maxPoint.x = Math.max(maxPoint.x, point.x);
                maxPoint.y = Math.max(maxPoint.y, point.y);
            }
        }

        return [
            new Phaser.Math.Vector2(minPoint.x, minPoint.y),
            new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
            new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
            new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
        ];
    }
}
