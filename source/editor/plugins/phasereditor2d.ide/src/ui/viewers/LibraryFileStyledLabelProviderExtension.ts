namespace phasereditor2d.ide.ui.viewers {

    import controls = colibri.ui.controls;

    export class LibraryFileStyledLabelProviderExtension extends colibri.Extension {

        constructor() {
            super(files.ui.viewers.StyledFileLabelProviderExtension.POINT_ID);
        }

        getStyledText(file: colibri.core.io.FilePath): colibri.ui.controls.viewers.IStyledText[] {

            if (core.code.isNodeLibraryFile(file) || core.code.isCopiedLibraryFile(file)) {

                const theme = controls.Controls.getTheme();

                return [{
                    color: theme.viewerForeground + "90",
                    text: file.getName()
                }];
            }
        }
    }
}