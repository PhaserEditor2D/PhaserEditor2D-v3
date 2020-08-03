namespace phasereditor2d.ide.core {

    import controls = colibri.ui.controls;

    export abstract class CompileProjectExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.ide.core.CompilerExtension";

        constructor() {
            super(CompileProjectExtension.POINT_ID);
        }

        abstract getTotal(): number;

        abstract preload(monitor: controls.IProgressMonitor);
    }
}