namespace phasereditor2d.code.ui {

    export class PreloadExtraLibsExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {

        async computeTotal(): Promise<number> {

            return this.getFiles().length;
        }

        private getFiles() {

            return colibri.ui.ide.FileUtils.getAllFiles()

                .filter(file => file.getName().endsWith(".d.ts"));
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            const utils = colibri.ui.ide.FileUtils;

            const files = this.getFiles();

            for (const file of files) {

                const content = await utils.preloadAndGetFileString(file);

                if (content) {

                    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(content, file.getFullName());
                }

                monitor.step();
            }
        }

    }
}