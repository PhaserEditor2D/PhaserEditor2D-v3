namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class TextureComponent {


        static textureKey = "textureKey";
        static frameKey = "frameKey";

        static write(sprite: gameobjects.EditorImage, data: any): void {

            const texture = sprite.getEditorTexture();

            write(data, this.textureKey, texture.key);
            write(data, this.frameKey, texture.frame);
        }

        static read(sprite: gameobjects.EditorImage, data: any): void {

            const key = read(data, this.textureKey);
            const frame = read(data, this.frameKey);

            sprite.setEditorTexture(key, frame);
            sprite.setTexture(key, frame);
        }

    }


}