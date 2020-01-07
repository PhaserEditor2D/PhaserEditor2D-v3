namespace phasereditor2d.pack.core {

    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;

    export class AssetPackPreloadProjectExtension extends ide.PreloadProjectResourcesExtension {

        constructor() {
            super();
        }

        async computeTotal(): Promise<number> {

            const packs = await AssetPackUtils.getAllPacks();

            const items = packs.flatMap(pack => pack.getItems());

            return items.length;
        }

        async preload(monitor: controls.IProgressMonitor) {

            const finder = new PackFinder();

            return finder.preload(monitor);
        }
    }
}