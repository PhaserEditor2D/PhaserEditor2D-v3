namespace phasereditor2d.code.ui {

    export class PreloadModelsExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {

        async computeTotal(): Promise<number> {

            return this.getFiles().length;
        }

        private getFiles() {

            return colibri.ui.ide.FileUtils.getAllFiles()

                .filter(file => file.getName().endsWith(".js"));
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            monaco.editor.getModels().forEach(model => model.dispose());

            const utils = colibri.ui.ide.FileUtils;

            const files = this.getFiles();

            for (const file of files) {

                const content = await utils.preloadAndGetFileString(file);

                if (typeof content === "string") {

                    monaco.editor.createModel(content, "javascript", CodePlugin.fileUri(file.getFullName()));
                }

                monitor.step();
            }
        }

    }
}