namespace phasereditor2d.scene.ui.editor.usercomponent {

    import code = core.code;
    import io = colibri.core.io;

    export class UserComponentCodeDOMBuilder {

        private _component: UserComponent;
        private _model: UserComponentsModel;
        // TODO: will be used for the "import" syntax
        private _modelFile: io.FilePath;
        private _unitDom: code.UnitCodeDOM;
        private _typeFileMap: Map<string, io.FilePath>;

        constructor(component: UserComponent, model: UserComponentsModel, file: io.FilePath) {

            this._component = component;
            this._model = model;
            this._modelFile = file;
        }

        build(): code.UnitCodeDOM {

            if (this._model.autoImport) {

                this.buildFilesMap();
            }

            this._unitDom = new code.UnitCodeDOM([]);

            const clsDom = this.createClass();

            this._unitDom.getBody().push(clsDom);

            return this._unitDom;
        }

        private buildFilesMap() {

            this._typeFileMap = new Map();

            colibri.ui.ide.FileUtils.visitProject(file => {

                if (file.getExtension() === "ts" || file.getExtension() === "js") {

                    this._typeFileMap.set(file.getNameWithoutExtension(), file);
                }
            });
        }

        private createClass() {

            const clsDom = new code.ClassDeclCodeDOM(this._component.getName());

            clsDom.setExportClass(this._model.exportClass);
            clsDom.setSuperClass(this._component.getBaseClass());

            this.addImportForType(clsDom.getSuperClass());

            this.buildConstructor(clsDom);

            this.buildFields(clsDom);

            this.buildAccessorMethods(clsDom);

            return clsDom;
        }

        private buildConstructor(clsDom: code.ClassDeclCodeDOM) {

            const ctrDeclDom = new code.MethodDeclCodeDOM("constructor");

            ctrDeclDom.arg("gameObject", this._component.getGameObjectType());

            if (this.isTypeScriptOutput()) {

                this.addImportForType(this._component.getGameObjectType());
            }

            const body = ctrDeclDom.getBody();

            const superClass = this._component.getBaseClass();

            if (superClass && superClass.trim() !== "") {

                const superCall = new code.MethodCallCodeDOM("super");
                superCall.arg("gameObject");
                body.push(superCall);
                body.push(new code.RawCodeDOM(""));
            }

            const initGameObjDom = new code.AssignPropertyCodeDOM("gameObject", "this");
            initGameObjDom.value("gameObject");
            body.push(initGameObjDom);

            const setCompDom = new code.RawCodeDOM(this.isTypeScriptOutput() ?
                `(gameObject as any)["__${clsDom.getName()}"] = this;`
                : `gameObject["__${clsDom.getName()}"] = this;`);
            body.push(setCompDom);

            body.push(new code.RawCodeDOM(""));
            body.push(new code.UserSectionCodeDOM("/* START-USER-CTR-CODE */", "/* END-USER-CTR-CODE */", "\n\t\t// Write your code here.\n\t\t"))

            this.buildCustomPropertiesInit(body);

            clsDom.getBody().push(new code.UserSectionCodeDOM(
                "/* START-USER-CODE */", "/* END-USER-CODE */", "\n\n\t// Write your code here.\n\n\t"));

            clsDom.getBody().push(ctrDeclDom);
        }

        private buildCustomPropertiesInit(body: code.CodeDOM[]) {

            const userProps = this._component.getUserProperties();

            const assignDomList = userProps.getProperties()

                .filter(prop => prop.isCustomDefinition())

                .map(prop => {

                    const fieldDecl = prop.buildFieldDeclarationCode();

                    const assignDom = new code.AssignPropertyCodeDOM(fieldDecl.getName(), "this");
                    assignDom.value(fieldDecl.getInitialValueExpr());

                    return assignDom;
                });

            if (assignDomList.length > 0) {

                body.push(new code.RawCodeDOM("\n"));
                body.push(new code.RawCodeDOM("// custom definition props"));
            }

            body.push(...assignDomList);
        }

        private addImportForType(type: string) {

            if (!this._model.autoImport) {

                return;
            }

            if (type) {


                if (type.startsWith("Phaser.")) {

                    this._unitDom.addImport("Phaser", "phaser", true);

                } else if (this._typeFileMap.has(type)) {

                    const importFile = this._typeFileMap.get(type);

                    const { importPath, asDefault } = code.getImportPath(this._modelFile, importFile);

                    this._unitDom.addImport(type, importPath, asDefault);
                }
            }
        }

        private buildFields(clsDom: code.ClassDeclCodeDOM) {

            // gameObject field

            const gameObjectFieldDecl = new code.FieldDeclCodeDOM("gameObject", this._component.getGameObjectType());
            gameObjectFieldDecl.setAllowUndefined(false);
            clsDom.getBody().push(gameObjectFieldDecl);

            // props fields

            const userProps = this._component.getUserProperties();

            for (const prop of userProps.getProperties()) {

                if (!prop.isCustomDefinition()) {

                    const fieldDecl = prop.buildFieldDeclarationCode();

                    clsDom.getBody().push(fieldDecl);
                }
            }

            if (this.isTypeScriptOutput()) {

                // add imports for field declarations

                for (const elem of clsDom.getBody()) {

                    if (elem instanceof code.FieldDeclCodeDOM) {

                        this.addImportForType(elem.getType());
                    }
                }
            }
        }

        private isTypeScriptOutput() {

            return this._model.outputLang === ide.core.code.SourceLang.TYPE_SCRIPT;
        }

        private buildAccessorMethods(clsDom: code.ClassDeclCodeDOM) {
            {
                // getComponent()

                const declDom = new code.MethodDeclCodeDOM("getComponent");
                declDom.getModifiers().push("static");
                declDom.arg("gameObject", this._component.getGameObjectType());
                declDom.setReturnType(clsDom.getName());

                const returnDom = new code.RawCodeDOM(this.isTypeScriptOutput() ?
                    `return (gameObject as any)["__${clsDom.getName()}"];`
                    : `return gameObject["__${clsDom.getName()}"];`)

                declDom.getBody().push(returnDom);
                clsDom.getBody().push(declDom);
            }
        }
    }
}