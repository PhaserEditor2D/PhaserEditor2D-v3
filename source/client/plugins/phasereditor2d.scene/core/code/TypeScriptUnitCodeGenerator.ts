namespace phasereditor2d.scene.core.code {

    export class TypeScriptUnitCodeGenerator extends JavaScriptUnitCodeGenerator {

        constructor(unit: UnitCodeDOM) {
            super(unit);
        }

        protected generateMemberDecl(memberDecl: MemberDeclCodeDOM) {

            if (memberDecl instanceof FieldDeclCodeDOM) {

                this.line("private " + memberDecl.getName() + ": " + memberDecl.getType() + ";");

            } else {

                super.generateMemberDecl(memberDecl);
            }
        }

        protected generateTypeAnnotation(assign: AssignPropertyCodeDOM) {
            // do nothing, in TypeScript uses the var declaration syntax
        }

        protected generateMethodDeclArgs(methodDecl: MethodDeclCodeDOM) {

            this.append(
                methodDecl.getArgs()
                    .map(arg => `${arg.name}${arg.optional ? "?" : ""}: ${arg.type}`)
                    .join(", ")
            );
        }
    }
}