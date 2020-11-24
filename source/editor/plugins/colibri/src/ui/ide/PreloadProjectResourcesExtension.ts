namespace colibri.ui.ide {

    export abstract class PreloadProjectResourcesExtension extends Extension {

        static POINT_ID = "colibri.ui.ide.PreloadProjectResourcesExtension";

        constructor() {
            super(PreloadProjectResourcesExtension.POINT_ID);
        }

        abstract computeTotal(): Promise<number>;

        abstract preload(monitor: controls.IProgressMonitor): Promise<any>;
    }

}