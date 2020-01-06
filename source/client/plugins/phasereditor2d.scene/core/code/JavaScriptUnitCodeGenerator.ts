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

            for (const elem of this._unit.getElements()) {

                this.generateUnitElement(elem);

            }

            this.sectionEnd("/* END OF COMPILED CODE */", "\n\n// You can write more code here\n");
        }

        private generateUnitElement(elem: object) {

            if (elem instanceof ClassDeclCodeDOM) {

                this.generateClass(elem as ClassDeclCodeDOM);

            } else if (elem instanceof MethodDeclCodeDOM) {

                this.line();

                this.generateMethodDecl(elem as MethodDeclCodeDOM, true);

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

            for (const memberDecl of clsDecl.getBody()) {

                this.generateMemberDecl(memberDecl);
                this.line();
            }

            this.section("/* START-USER-CODE */", "\t/* END-USER-CODE */", "\n\n\t// Write your code here.\n\n");

            this.closeIndent("}");

            this.line();
        }

        protected generateMemberDecl(memberDecl: MemberDeclCodeDOM) {

            if (memberDecl instanceof MethodDeclCodeDOM) {

                this.generateMethodDecl(memberDecl, false);

            } else if (memberDecl instanceof FieldDeclCodeDOM) {

                this.generateFieldDecl(memberDecl);
            }
        }

        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM) {

            this.append(`// ${fieldDecl.isPublic() ? "public" : "private"} `);
            this.line(`${fieldDecl.getName()}: ${fieldDecl.getType()}`);
        }

        private generateMethodDecl(methodDecl: MethodDeclCodeDOM, isFunction: boolean) {

            if (isFunction) {
                this.append("function ");
            }

            this.append(methodDecl.getName() + "(");

            this.generateMethodDeclArgs(methodDecl);

            this.openIndent(") {");

            for (const instr of methodDecl.getBody()) {

                this.generateInstr(instr);
            }

            this.closeIndent("}");
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
            this.append(assign.getContextExpr());
            this.append(".");
            this.append(assign.getPropertyName());
            this.append(" = ");
            this.append(assign.getPropertyValueExpr());
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

                    this.append(call.isDeclareReturnToField() ? "this." : "const ");
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

            this.join(call.getArgs());

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