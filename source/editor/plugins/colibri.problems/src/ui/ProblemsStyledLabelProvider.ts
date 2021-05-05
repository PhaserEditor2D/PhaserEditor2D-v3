namespace colibri.problems.ui {

    import controls = colibri.ui.controls;

    export class ProblemsStyledLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: core.Problem, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            return [
                {
                    text: obj.type.name + ": ",
                    color: theme.viewerForeground
                },
                {
                    text: obj.message,
                    color: theme.viewerForeground
                },
                {
                    text: " - " + obj.file.getProjectRelativeName(),
                    color: theme.viewerForeground + "90"
                }
            ];
        }
    }
}