namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class ObjectComponent {

        static write(sprite: sceneobjects.SceneObject, data: any): void {

            write(data, "id", sprite.getEditorSupport().getId());
            write(data, "type", sprite.type);
        }

        static read(sprite: sceneobjects.SceneObject, data: any): void {

            sprite.getEditorSupport().setId(read(data, "id"));
        }

    }

}