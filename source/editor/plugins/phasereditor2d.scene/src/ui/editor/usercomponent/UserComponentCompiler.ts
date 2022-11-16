namespace phasereditor2d.scene.ui.editor.usercomponent {

    import io = colibri.core.io;
    import code = core.code;

    export class UserComponentCompiler {

        private _componentsFile: io.FilePath;
        private _model: UserComponentsModel;

        constructor(componentsFile: io.FilePath, model: UserComponentsModel) {

            this._componentsFile = componentsFile;
            this._model = model;
        }

        async compile() {

            for (const userComp of this._model.getComponents()) {

                const builder = new UserComponentCodeDOMBuilder(userComp, this._model, this._componentsFile);
                const unitDom = builder.build();
                const generator = this.isJavaScriptOutput() ?
                    new code.JavaScriptUnitCodeGenerator(unitDom) :
                    new code.TypeScriptUnitCodeGenerator(unitDom);

                if (this.isJavaScriptOutput()) {

                    generator.setInitFieldInConstructor(this._model.javaScriptInitFieldsInConstructor);
                }

                let replace = "";

                const outFile = this.getOutputFile(userComp.getName());

                if (outFile) {

                    replace = await colibri.ui.ide.FileUtils.preloadAndGetFileString(outFile);
                }

                let output = generator.generate(replace);

                if (this._model.insertSpaces) {

                    const tabs = " ".repeat(Math.max(1, this._model.tabSize));

                    output = output.replace(/\t/g, tabs);
                }

                const folder = this._componentsFile.getParent();
                const fileName = this.getOutputFileName(userComp.getName());

                await colibri.ui.ide.FileUtils.createFile_async(folder, fileName, output);
            }
        }

        isJavaScriptOutput() {

            return this._model.getOutputLang() === ide.core.code.SourceLang.JAVA_SCRIPT;
        }

        getOutputFile(userCompName: string) {

            const file = this._componentsFile.getSibling(this.getOutputFileName(userCompName));

            return file;
        }

        getOutputFileName(userCompName: string) {

            return userCompName + "." + (this.isJavaScriptOutput() ? "js" : "ts")
        }
    }
}