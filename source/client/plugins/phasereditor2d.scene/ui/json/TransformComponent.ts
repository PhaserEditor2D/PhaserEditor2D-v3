namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export declare type TransformLike = gameobjects.EditorImage|gameobjects.EditorContainer;

    export class TransformComponent {

        static write(sprite: TransformLike, data: any): void {

            write(data, "x", sprite.x, 0);
            write(data, "y", sprite.y, 0);
            write(data, "scaleX", sprite.scaleX, 1);
            write(data, "scaleY", sprite.scaleY, 1);
            write(data, "angle", sprite.angle, 0);

        }

        static read(sprite: TransformLike, data: any): void {

            sprite.x = read(data, "x", 0);
            sprite.y = read(data, "y", 0);
            sprite.scaleX = read(data, "scaleX", 1);
            sprite.scaleY = read(data, "scaleY", 1);
            sprite.angle = read(data, "angle", 0);

        }

    }

}