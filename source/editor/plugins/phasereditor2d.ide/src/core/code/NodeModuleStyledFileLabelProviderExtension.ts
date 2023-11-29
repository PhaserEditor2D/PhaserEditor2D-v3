namespace phasereditor2d.ide.core.code {

    import controls = colibri.ui.controls;

    export class NodeModuleStyledFileLabelProviderExtension extends colibri.Extension {

        constructor() {
            super(files.ui.viewers.StyledFileLabelProviderExtension.POINT_ID);
        }

        getStyledText(file: colibri.core.io.FilePath): colibri.ui.controls.viewers.IStyledText[] {

            if (isNodeModuleFile(file)) {

                const theme = controls.Controls.getTheme();

                return [{
                    color: theme.viewerForeground + "90",
                    text: file.getName()
                }];
            }
        }
    }
}