namespace phasereditor2d.code.ui {

    export class PreloadJavaScriptWorkerExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {

        async computeTotal(): Promise<number> {

            return 1;
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            const getWorker = await monaco.languages.typescript.getJavaScriptWorker();

            const worker = await getWorker();

            CodePlugin.getInstance().setJavaScriptWorker(worker);

            monitor.step();
        }

    }
}