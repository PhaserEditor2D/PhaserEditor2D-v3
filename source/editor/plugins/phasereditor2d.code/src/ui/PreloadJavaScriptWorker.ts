namespace phasereditor2d.code.ui {

    export class PreloadJavaScriptWorkerExtension extends colibri.ui.ide.PreloadProjectResourcesExtension {

        async computeTotal(): Promise<number> {

            return 1;
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            try {

                await CodePlugin.getInstance().getJavaScriptWorker();

            } catch (e) {

                console.error(e);
            }

            monitor.step();
        }
    }
}