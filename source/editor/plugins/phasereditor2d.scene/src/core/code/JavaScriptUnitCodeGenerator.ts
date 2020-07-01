namespace phasereditor2d.scene.core.code {

    export class JavaScriptUnitCodeGenerator extends BaseCodeGenerator {

        private _unit: UnitCodeDOM;

        constructor(unit: UnitCodeDOM) {
            super();

            this._unit = unit;
        }

        protected internalGenerate(): void {

            this.sectionStart("/* START OF COMPILED CODE */", "\n// You can write more code here\n\n");

            this.line();
            this.line();

            const body = CodeDOM.removeBlankLines(this._unit.getBody());

            for (const elem of body) {

                this.generateUnitElement(elem);
            }

            this.sectionEnd("/* END OF COMPILED CODE */", "\n\n// You can write more code here\n");
        }

        private generateUnitElement(elem: object) {

            if (elem instanceof ClassDeclCodeDOM) {

                this.generateClass(elem as ClassDeclCodeDOM);

            } else if (elem instanceof MethodDeclCodeDOM) {

                this.line();

                this.generateMethodDecl(null, elem as MethodDeclCodeDOM, true);

                this.line();
            }

        }

        private generateClass(clsDecl: ClassDeclCodeDOM) {

            this.append("class " + clsDecl.getName() + " ");

            if (clsDecl.getSuperClass() && clsDecl.getSuperClass().trim().length > 0) {

                this.append("extends " + clsDecl.getSuperClass() + " ");
            }

            this.openIndent("{");

            this.line();

            const body = CodeDOM.removeBlankLines(clsDecl.getBody());

            for (const memberDecl of body) {

                this.generateMemberDecl(clsDecl, memberDecl);
            }

            this.lineIfNeeded();

            this.section("/* START-USER-CODE */", "/* END-USER-CODE */", "\n\n\t// Write your code here.\n\n\t");

            this.closeIndent("}");

            this.line();
        }

        protected generateMemberDecl(classDecl: ClassDeclCodeDOM, memberDecl: MemberDeclCodeDOM) {

            if (memberDecl instanceof MethodDeclCodeDOM) {

                this.generateMethodDecl(classDecl, memberDecl, false);

                this.line();

            } else if (memberDecl instanceof FieldDeclCodeDOM) {

                this.generateFieldDecl(memberDecl);
            }
        }

        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM) {

            // We comment this off because Safari does not support field declarations (issue #45)

            // this.line(`/** @type {${fieldDecl.getType()}} */`);

            // if (fieldDecl.isInitialized()) {

            //     this.line(fieldDecl.getName() + " = " + fieldDecl.getInitialValueExpr() + ";");

            // } else {

            //     this.line(fieldDecl.getName() + ";");
            // }

            // this.line();
        }

        private generateMethodDecl(classDecl: ClassDeclCodeDOM, methodDecl: MethodDeclCodeDOM, isFunction: boolean) {

            if (isFunction) {
                this.append("function ");
            }

            this.append(methodDecl.getName() + "(");

            this.generateMethodDeclArgs(methodDecl);

            this.openIndent(") {");

            const body = CodeDOM.removeBlankLines(methodDecl.getBody());

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

                if (methodDecl.getName() === "constructor") {

                    this.generateFieldInitInConstructor(classDecl);
                }
            }

            this.closeIndent("}");
        }

        protected generateFieldInitInConstructor(classDecl: ClassDeclCodeDOM) {

            const fields = classDecl.getBody()

                .filter(obj => obj instanceof FieldDeclCodeDOM)

                .map(obj => obj as FieldDeclCodeDOM);

            if (fields.length > 0) {

                this.line();

                for (const field of fields) {

                    const assign = new AssignPropertyCodeDOM(field.getName(), "this");
                    assign.setPropertyType(field.getType());
                    assign.value(field.getInitialValueExpr());

                    this.generateAssignProperty(assign);
                }
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
            }
        }

        private generateAssignProperty(assign: AssignPropertyCodeDOM) {

            this.generateTypeAnnotation(assign);

            if (assign.getContextExpr()) {

                this.append(assign.getContextExpr());
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
                this.append(".");
            }

            this.append(call.getMethodName());
            this.append("(");

            const args = [...call.getArgs()];

            while (args.length > 0 && args[args.length - 1] === "undefined") {

                args.pop();
            }

            this.join(args);

            this.line(");");
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