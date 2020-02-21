namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export class SceneCompiler {

        private _scene: ui.Scene;
        private _sceneFile: io.FilePath;

        constructor(scene: ui.Scene, sceneFile: io.FilePath) {

            this._scene = scene;
            this._sceneFile = sceneFile;
        }

        async compile() {

            const compileToJS = this._scene.getSettings()
                .compilerOutputLanguage === json.SourceLang.JAVA_SCRIPT;

            const builder = new core.code.SceneCodeDOMBuilder(this._scene, this._sceneFile);

            const unit = await builder.build();

            if (!unit) {

                return;
            }

            const generator = compileToJS ?
                new core.code.JavaScriptUnitCodeGenerator(unit)
                : new core.code.TypeScriptUnitCodeGenerator(unit);

            const fileExt = compileToJS ? "js" : "ts";
            const fileName = this._sceneFile.getNameWithoutExtension() + "." + fileExt;

            let replaceContent = "";

            {
                const outputFile = this._sceneFile.getSibling(fileName);

                if (outputFile) {

                    replaceContent = await ide.FileUtils.getFileStorage().getFileString(outputFile);
                }
            }

            const output = generator.generate(replaceContent);

            await ide.FileUtils.createFile_async(this._sceneFile.getParent(), fileName, output);
        }

    }
}