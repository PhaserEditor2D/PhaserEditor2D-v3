namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;

    export class SceneScriptCellRenderer implements controls.viewers.ICellRenderer {

        private _layout: "grid" | "tree";

        constructor(layout: "grid" | "tree") {
            this._layout = layout;
        }

        private getIconRenderer(icon: controls.IImage) {

            if (this._layout === "grid") {

                return new controls.viewers.IconGridCellRenderer(icon);
            }

            return new controls.viewers.IconImageCellRenderer(icon);
        }

        renderCell(args: controls.viewers.RenderCellArgs): void {

            const result = this.getSceneFile(args.obj);

            if (result) {

                const args2 = args.clone();
                args2.obj = result.sceneFile;
                result.renderer.renderCell(args2);

                return;
            }

            const icon = colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_FILE);

            const iconRenderer = this.getIconRenderer(icon);

            iconRenderer.renderCell(args);
        }

        private getSceneFile(obj: core.AssetPackItem) {

            const file = obj.getFileFromAssetUrl(obj.getData().url);

            if (file) {

                const sceneFile = file.getParent().getFile(file.getNameWithoutExtension() + ".scene");

                if (sceneFile) {

                    const provider = new files.ui.viewers.FileCellRendererProvider(this._layout);

                    const renderer = provider.getCellRenderer(sceneFile);

                    return {
                        renderer: renderer,
                        sceneFile: sceneFile
                    };
                }
            }

            return null;
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            const result = this.getSceneFile(args.obj);

            if (result) {

                const args2 = args.clone();
                args2.obj = result.sceneFile;

                return result.renderer.preload(args2);
            }

            return controls.Controls.resolveNothingLoaded();
        }

        cellHeight(args: controls.viewers.RenderCellArgs): number {

            return args.viewer.getCellSize();
        }
    }
}