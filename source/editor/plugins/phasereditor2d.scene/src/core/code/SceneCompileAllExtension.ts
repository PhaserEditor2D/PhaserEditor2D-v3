namespace phasereditor2d.scene.core.code {

    export class SceneCompileAllExtension extends phasereditor2d.ide.core.CompileProjectExtension {

        private getFiles() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return finder.getSceneFiles();
        }

        getTotal(): number {

            return this.getFiles().length;
        }

        async preload(monitor: colibri.ui.controls.IProgressMonitor) {

            const files = this.getFiles();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            monitor.addTotal(files.length);

            for (const file of files) {

                const data = finder.getSceneData(file);

                const scene = await ui.OfflineScene.createScene(data);

                const compiler = new core.code.SceneCompiler(scene, file);

                await compiler.compile();

                scene.destroyGame();

                monitor.step();
            }
        }
    }
}