namespace phasereditor2d.files.ui.viewers {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export abstract class StyledFileLabelProviderExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.views.FileStyledLabelProviderExtension";

        constructor() {
            super(StyledFileLabelProviderExtension.POINT_ID);
        }

        abstract getStyledText(file: io.FilePath): controls.viewers.IStyledText[] | null;
    }
}