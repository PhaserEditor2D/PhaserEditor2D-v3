namespace phasereditor2d.code.ui.editors.outline {

    import controls = colibri.ui.controls;

    export class MonacoOutlineCellRendererProvider implements controls.viewers.ICellRendererProvider {

        private static map = {
            class: ICON_SYMBOL_CLASS,
            const: ICON_SYMBOL_CONSTANT,
            field: ICON_SYMBOL_FIELD,
            interface: ICON_SYMBOL_INTERFACE,
            method: ICON_SYMBOL_METHOD,
            function: ICON_SYMBOL_METHOD,
            constructor: ICON_SYMBOL_METHOD,
            namespace: ICON_SYMBOL_NAMESPACE,
            property: ICON_SYMBOL_PROPERTY,
            variable: ICON_SYMBOL_VARIABLE,
        };

        getCellRenderer(obj: any): controls.viewers.ICellRenderer {

            let name: string;

            if (typeof obj.kind === "string") {
                name = MonacoOutlineCellRendererProvider.map[obj.kind];
            }

            if (!name) {

                name = ICON_SYMBOL_VARIABLE;
            }

            const img = CodePlugin.getInstance().getIcon(name);

            return new controls.viewers.IconImageCellRenderer(img);
        }

        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.Controls.resolveNothingLoaded();
        }
    }
}