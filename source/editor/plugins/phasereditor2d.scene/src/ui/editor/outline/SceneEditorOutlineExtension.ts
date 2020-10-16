namespace phasereditor2d.scene.ui.editor.outline {

    import controls = colibri.ui.controls;

    export abstract class SceneEditorOutlineExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.outline.SceneEditorOutlineProviderExtension";

        constructor() {
            super(SceneEditorOutlineExtension.POINT_ID);
        }

        abstract isLabelProviderFor(element: any): boolean;

        abstract getLabelProvider(): controls.viewers.ILabelProvider;

        abstract isCellRendererProviderFor(element: any): boolean;

        abstract getCellRendererProvider(): controls.viewers.ICellRendererProvider;

        abstract isContentProviderFor(parent: any): boolean;

        abstract getContentProvider(): controls.viewers.ITreeContentProvider;
    }
}