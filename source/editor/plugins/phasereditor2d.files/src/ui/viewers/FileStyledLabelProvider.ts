namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class FileStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: io.FilePath, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            const result = [
                {
                    text: obj.getName(),
                    color: theme.viewerForeground
                }
            ];

            if (obj.getParent()) {

                let path = obj.getParent().getProjectRelativeName();

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