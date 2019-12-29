namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class TextureComponent {

        static textureKey = "textureKey";
        static frameKey = "frameKey";

        static write(sprite: sceneobjects.Image, data: any): void {

            const texture = sprite.getEditorSupport().getTexture();

            write(data, this.textureKey, texture.key);
            write(data, this.frameKey, texture.frame);
        }

        static read(sprite: sceneobjects.Image, data: any): void {

            const key = read(data, this.textureKey);
            const frame = read(data, this.frameKey);

            sprite.getEditorSupport().setTexture(key, frame);
            sprite.setTexture(key, frame);
        }
    }
}