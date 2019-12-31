namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;

    export abstract class ContentTypeCellRendererExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.viewers.ContentTypeCellRendererExtension";

        abstract getRendererProvider(contentType: string): controls.viewers.ICellRendererProvider;

        constructor() {
            super(ContentTypeCellRendererExtension.POINT_ID);
        }
    }
}