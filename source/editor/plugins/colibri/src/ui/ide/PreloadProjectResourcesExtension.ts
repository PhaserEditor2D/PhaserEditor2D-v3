namespace colibri.ui.ide {

    export abstract class PreloadProjectResourcesExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.PreloadProjectResourcesExtension";

        constructor() {
            super(PreloadProjectResourcesExtension.POINT_ID);
        }

        abstract async computeTotal(): Promise<number>;

        abstract async preload(monitor: controls.IProgressMonitor);
    }

}