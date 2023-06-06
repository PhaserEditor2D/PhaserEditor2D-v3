namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class KeyboardKeysViewer extends controls.viewers.TreeViewer {

        constructor() {
            super("KeyboardKeysViewer");

            this.setLabelProvider(new controls.viewers.LabelProvider(obj => obj));
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            this.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider());
            this.setInput(KeyboardKeyExtension.getInstance().getKeyCodes());
        }
    }
}