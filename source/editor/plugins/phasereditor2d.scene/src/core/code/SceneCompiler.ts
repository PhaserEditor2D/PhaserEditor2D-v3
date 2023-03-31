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

        getOutputFile() {

            const settings = this._scene.getSettings();

            const compileToJS = settings.compilerOutputLanguage === phasereditor2d.ide.core.code.SourceLang.JAVA_SCRIPT;

            const fileExt = compileToJS ? "js" : "ts";
            const fileName = this._sceneFile.getNameWithoutExtension() + "." + fileExt;

            const outputFile = this._sceneFile.getSibling(fileName);

            return outputFile;
        }

        async compile() {

            console.log(`Compiling ${this._sceneFile.getName()}`);

            const settings = this._scene.getSettings();

            if (!settings.compilerEnabled) {

                return;
            }

            const compileToJS = settings.compilerOutputLanguage === phasereditor2d.ide.core.code.SourceLang.JAVA_SCRIPT;

            const builder = new core.code.SceneCodeDOMBuilder(this._scene, this._sceneFile);

            const unit = await builder.build();

            if (!unit) {

                return;
            }

            const generator = compileToJS ?
                new core.code.JavaScriptUnitCodeGenerator(unit)
                : new core.code.TypeScriptUnitCodeGenerator(unit);

            if (compileToJS) {

                generator.setInitFieldInConstructor(settings.javaScriptInitFieldsInConstructor);
            }

            generator.setGenerateImports(settings.autoImport);

            const fileExt = compileToJS ? "js" : "ts";
            const fileName = this._sceneFile.getNameWithoutExtension() + "." + fileExt;

            let replaceContent = "";

            {
                const outputFile = this._sceneFile.getSibling(fileName);

                if (outputFile) {

                    replaceContent = await ide.FileUtils.getFileStorage().getFileString(outputFile);
                }
            }

            let output = generator.generate(replaceContent);

            if (settings.compilerInsertSpaces) {

                const tabs = " ".repeat(Math.max(1, settings.compilerTabSize));

                output = output.replace(/\t/g, tabs);
            }

            await ide.FileUtils.createFile_async(this._sceneFile.getParent(), fileName, output);
        }

    }
}