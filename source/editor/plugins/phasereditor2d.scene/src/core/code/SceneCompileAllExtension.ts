namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;

    export class SceneCompileAllExtension extends phasereditor2d.ide.core.CompileProjectExtension {

        private getFiles() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return finder.getSceneFiles(false);
        }

        getTotal(): number {

            return this.getFiles().length;
        }


        static async compileSceneFile(file: io.FilePath) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const data = finder.getSceneData(file);

            const scene = await ui.OfflineScene.createScene(data);

            const compiler = new core.code.SceneCompiler(scene, file);

            await compiler.compile();

            scene.destroyGame();
        }

        async compile(monitor: colibri.ui.controls.IProgressMonitor) {

            const files = this.getFiles();

            monitor.addTotal(files.length);

            for (const file of files) {

                await SceneCompileAllExtension.compileSceneFile(file);

                monitor.step();
            }
        }
    }
}