namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class ObjectComponent {

        static write(sprite: gameobjects.EditorObject, data: any): void {

            write(data, "id", sprite.getEditorId());
            write(data, "type", sprite.type);
        }

        static read(sprite: gameobjects.EditorObject, data: any): void {
            
            sprite.setEditorId(read(data, "id"));
        }

    }

}