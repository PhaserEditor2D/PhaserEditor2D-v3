namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class OpenFileLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(file: io.FilePath, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            const result = [
                {
                    text: file.getName(),
                    color: theme.viewerForeground
                }
            ];

            if (file.getParent()) {

                let path = file.getParent().getProjectRelativeName();

                if (path.startsWith("/")) {

                    path = " - " + path.substring(1);
                }

                if (path !== "") {

                    result.push({
                        text: path,
                        color: theme.viewerForeground + "90"
                    });
                }
            }

            return result;
        }
    }
}