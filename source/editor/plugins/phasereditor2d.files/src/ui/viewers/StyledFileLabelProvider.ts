namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;

    export class StyledFileLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(file: colibri.core.io.FilePath, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            if (file.getName() === "publicroot") {
                return [{
                    text: file.getName(),
                    color: dark ? "red" : "brown"
                }];
            }

            if (file.isFolder() && file.getFile("publicroot")) {

                return [{
                    text: file.getName(),
                    color: theme.viewerForeground
                }, {
                    text: " > public root",
                    color: dark ? "lightGreen" : "darkGreen"
                }];
            }

            return [{
                text: file.getName(),
                color: theme.viewerForeground
            }];
        }
    }
}