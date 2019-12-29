namespace phasereditor2d.scene.ui.json {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class VariableComponent {

        static write(sprite: sceneobjects.SceneObject, data: any): void {
            write(data, "label", sprite.getEditorSupport().getLabel());
        }

        static read(sprite: sceneobjects.SceneObject, data: any): void {
            sprite.getEditorSupport().setLabel(read(data, "label"));
        }

    }

}