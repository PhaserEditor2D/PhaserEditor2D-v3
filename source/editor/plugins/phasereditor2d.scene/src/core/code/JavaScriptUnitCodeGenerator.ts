namespace phasereditor2d.scene.core.code {

    import BaseCodeGenerator = ide.core.code.BaseCodeGenerator;

    export class JavaScriptUnitCodeGenerator extends BaseCodeGenerator {

        private _unit: UnitCodeDOM;
        private _initFieldsInConstructor: boolean;
        private _generateImports: boolean;

        constructor(unit: UnitCodeDOM) {
            super();

            this._unit = unit;
            this._generateImports = true;
        }

        isTypeScript() {

            return false;
        }

        getUnit() {

            return this._unit;
        }

        setInitFieldInConstructor(initFieldInConstructor: boolean) {

            this._initFieldsInConstructor = initFieldInConstructor;
        }

        isInitFieldInConstructor() {

            return this._initFieldsInConstructor;
        }

        setGenerateImports(generateImports: boolean) {

            this._generateImports = generateImports;
        }

        isGenerateImports() {

            return this._generateImports;
        }

        protected internalGenerate(): void {

            this.sectionStart("/* START OF COMPILED CODE */", "\n// You can write more code here\n\n");

            this.line();
            this.line();

            const body = CodeDOM.removeBlankLines(this._unit.getBody());

            if (this._generateImports) {

                this.generateImports();
            }

            this.generateExtraUnitCode();

            for (const elem of body) {

                this.generateUnitElement(elem);
            }

            this.sectionEnd("/* END OF COMPILED CODE */", "\n\n// You can write more code here\n");
        }

        protected generateUnitElement(elem: CodeDOM) {

            if (elem instanceof InterfaceDeclCodeDOM) {

                this.generateInterface(elem);

            } else if (elem instanceof ClassDeclCodeDOM) {

                this.generateClass(elem as ClassDeclCodeDOM);

            } else if (elem instanceof MethodDeclCodeDOM) {

                this.line();

                this.generateMethodDecl(null, elem as MethodDeclCodeDOM, true);

                this.line();

            } else if (elem instanceof RawCodeDOM) {

                this.line();
                this.line(elem.getCode());
                this.line();
            }
        }

        protected generateInterface(interfaceDecl: InterfaceDeclCodeDOM) {
            // nothing, it is for the TypeScript generator
        }

        protected generateExtraUnitCode() {
            // nothing, used by the TypeScript generator
        }

        private generateImports() {

            const imports = this._unit.getImports();

            for (const importDom of imports) {

                let name = importDom.getElementName();

                if (!importDom.isAsDefault()) {

                    name = `{ ${name} }`;
                }

                this.line(`import ${name} from "${importDom.getFilePath()}";`);
            }

            this.section("/* START-USER-IMPORTS */", "/* END-USER-IMPORTS */", "\n");

            this.line();
            this.line();
        }

        private generateClass(clsDecl: ClassDeclCodeDOM) {

            if (clsDecl.isExportClass()) {

                this.append("export default ");
            }

            this.append("class " + clsDecl.getName() + " ");

            if (clsDecl.getSuperClass() && clsDecl.getSuperClass().trim().length > 0) {

                this.append("extends " + clsDecl.getSuperClass() + " ");
            }

            this.openIndent("{");

            this.line();

            const body = CodeDOM.removeBlankLines(clsDecl.getBody());

            // methods

            for (const memberDecl of body) {

                if (memberDecl instanceof MethodDeclCodeDOM) {

                    this.generateMethodDecl(clsDecl, memberDecl, false);

                    this.line();
                }
            }

            // fields

            for (const memberDecl of body) {

                if (memberDecl instanceof FieldDeclCodeDOM) {

                    this.generateFieldDecl(memberDecl);
                }
            }

            if (body.find(m => m instanceof FieldDeclCodeDOM)) {

                this.line();
            }

            // user section

            for (const memberDecl of body) {

                if (memberDecl instanceof UserSectionCodeDOM) {

                    this.generateSection(memberDecl);
                }
            }

            // close body

            this.closeIndent("}");

            this.line();
        }

        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM) {

            if (this._initFieldsInConstructor) {

                return;
            }

            this.line(`/** @type {${fieldDecl.getType()}} */`);

            if (fieldDecl.isInitialized()) {

                this.line(fieldDecl.getName() + " = " + fieldDecl.getInitialValueExpr() + ";");

            } else {

                this.line(fieldDecl.getName() + ";");
            }
        }

        private generateMethodDecl(classDecl: ClassDeclCodeDOM, methodDecl: MethodDeclCodeDOM, isFunction: boolean) {

            if (methodDecl.getReturnType()) {

                this.generateMethodReturnTypeJSDoc(methodDecl);
            }

            for (const modifier of methodDecl.getModifiers()) {

                this.append(modifier + " ");
            }

            if (isFunction) {

                this.append("function ");
            }

            this.append(methodDecl.getName() + "(");

            this.generateMethodDeclArgs(methodDecl);

            const methodReturnDeclText = this.getMethodReturnDeclText(methodDecl);

            this.openIndent(")" + methodReturnDeclText + "{");

            let body = CodeDOM.removeBlankLines(methodDecl.getBody());

            if (this._initFieldsInConstructor && methodDecl.getName() === "constructor") {

                const superCall = body.find(instr => instr instanceof MethodCallCodeDOM && instr.getMethodName() === "super");

                if (superCall) {

                    this.generateMethodCall(superCall);

                    body = body.filter(instr => instr !== superCall);
                }

                this.generateFieldInitInConstructor(classDecl, methodDecl);
            }

            // never add a blank line at the end of a method body

            if (body.length > 0) {

                const last = body.pop();

                if (last instanceof RawCodeDOM) {

                    if (!CodeDOM.isBlankLine(last)) {

                        body.push(last);
                    }

                } else {

                    body.push(last);
                }

                for (const instr of body) {

                    this.generateInstr(instr);
                }
            }

            this.closeIndent("}");
        }

        generateMethodReturnTypeJSDoc(methodDecl: MethodDeclCodeDOM) {

            this.line(`/** @returns {${methodDecl.getReturnType()}} */`);
        }

        getMethodReturnDeclText(methodDecl: MethodDeclCodeDOM) {

            return " ";
        }

        private generateFieldInitInConstructor(classDecl: ClassDeclCodeDOM, ctrDecl: MethodDeclCodeDOM) {

            const fields: FieldDeclCodeDOM[] = classDecl.getBody()

                .filter(obj => obj instanceof FieldDeclCodeDOM) as any;

            if (fields.length > 0) {

                this.line();

                for (const field of fields) {

                    const assign = new AssignPropertyCodeDOM(field.getName(), "this");
                    assign.setPropertyType(field.getType());
                    assign.value(field.getInitialValueExpr());

                    this.generateAssignProperty(assign);
                }

                this.line();
            }
        }

        protected generateMethodDeclArgs(methodDecl: MethodDeclCodeDOM) {

            this.append(
                methodDecl.getArgs()
                    .map(arg => arg.name)
                    .join(", ")
            );
        }

        private generateInstr(instr: CodeDOM) {

            instr.setOffset(this.getOffset());

            if (instr instanceof RawCodeDOM) {

                this.generateRawCode(instr);

            } else if (instr instanceof MethodCallCodeDOM) {

                this.generateMethodCall(instr);

            } else if (instr instanceof AssignPropertyCodeDOM) {

                this.generateAssignProperty(instr);

            } else if (instr instanceof UserSectionCodeDOM) {

                this.generateSection(instr);
            }
        }

        private generateSection(section: UserSectionCodeDOM) {

            this.section(section.getOpenTag(), section.getCloseTag(), section.getDefaultContent());
        }

        private generateAssignProperty(assign: AssignPropertyCodeDOM) {

            this.generateTypeAnnotation(assign);

            if (assign.getContextExpr()) {

                this.append(assign.getContextExpr());

                if (this.isTypeScript() && assign.isOptionalContext()) {

                    this.append("!");
                }
                
                this.append(".");
            }

            this.append(assign.getPropertyName());

            if (assign.getPropertyValueExpr()) {

                this.append(" = ");
                this.append(assign.getPropertyValueExpr());
            }

            this.append(";");
            this.line();
        }

        protected generateTypeAnnotation(assign: AssignPropertyCodeDOM) {

            const type = assign.getPropertyType();

            if (type != null) {

                this.line("/** @type {" + type + "} */");
            }
        }

        private generateMethodCall(call: MethodCallCodeDOM) {

            if (call.getReturnToVar()) {

                if (call.isDeclareReturnToVar()) {

                    if (!this.isTypeScript() && call.getExplicitType()) {

                        this.line(`/** @type {${call.getExplicitType()}} */`);
                    }

                    this.append("const ");
                }

                this.append(call.getReturnToVar());
                this.append(" = ");
            }

            if (call.isConstructor()) {

                this.append("new ");
            }

            if (call.getContextExpr() && call.getContextExpr().length > 0) {

                this.append(call.getContextExpr());

                if (this.isTypeScript() && call.isOptionalContext()) {

                    this.append("!");
                }

                this.append(".");
            }

            this.append(call.getMethodName());
            this.append("(");

            const args = [...call.getArgs()];

            while (args.length > 0 && args[args.length - 1] === "undefined") {

                args.pop();
            }

            this.join(args);

            if (this.isTypeScript()
                && (call.getExplicitType() || call.isNonNullAssertion())
                && call.isDeclareReturnToVar()
                && call.getReturnToVar()) {

                let line = ")";

                if (call.isNonNullAssertion()) {

                    line += "!";
                }

                if (call.getExplicitType()) {

                    line += ` as ${call.getExplicitType()}`;
                }

                line += ";";

                this.line(line);

            } else {

                this.line(");");
            }
        }

        private generateRawCode(raw: RawCodeDOM) {

            const code = raw.getCode();

            const lines = code.split("\\R");

            for (const line of lines) {
                this.line(line);
            }
        }
    }
}