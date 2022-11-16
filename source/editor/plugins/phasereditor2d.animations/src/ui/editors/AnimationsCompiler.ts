namespace phasereditor2d.animations.ui.editors {

    import BaseCodeGenerator = ide.core.code.BaseCodeGenerator;
    import io = colibri.core.io;

    export class AnimationsCompiler extends BaseCodeGenerator {

        private _typeName: string;
        private _model: AnimationsModel;

        constructor(model: AnimationsModel) {
            super();

            this._model = model;
        }

        async compileFile(animsFile: io.FilePath, tsFile: io.FilePath) {

            this._typeName = animsFile.getNameWithoutExtension();
            this._typeName = "T" + this._typeName[0].toUpperCase() + this._typeName.substring(1);

            const replace = await colibri.ui.ide.FileUtils.preloadAndGetFileString(tsFile);

            const newContent = this.generate(replace);

            await colibri.ui.ide.FileUtils.setFileString_async(tsFile, newContent);
        }

        protected internalGenerate(): void {

            const anims = this._model.getModelData().anims;

            const keys = anims.map(a => a.key);

            this.line("// The constants with the animation keys.");

            for(const key of keys) {

                this.line();

                if (this._model.esModule) {

                    this.append("export ")
                }

                const varname = "ANIM_" + this.formatVariableName(key).toUpperCase();

                this.line(`const ${varname} = "${key}";`);
            }
        }
    }
}