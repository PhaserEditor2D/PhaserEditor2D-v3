namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentCompileAllExtension extends ide.core.CompileProjectExtension {

        getTotal(): number {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return finder.getUserComponentsModels().length;
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const infos = finder.getUserComponentsModels();

            for (const info of infos) {

                const compiler = new UserComponentCompiler(info.file, info.model);

                await compiler.compile();

                monitor.step();
            }
        }
    }
}