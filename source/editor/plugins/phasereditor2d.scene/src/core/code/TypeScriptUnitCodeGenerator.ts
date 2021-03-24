namespace phasereditor2d.scene.core.code {

    export class TypeScriptUnitCodeGenerator extends JavaScriptUnitCodeGenerator {

        constructor(unit: UnitCodeDOM) {
            super(unit);
        }

        generateMethodReturnTypeJSDoc(methodDecl: MethodDeclCodeDOM) {
            // nothing, it is made in signature
        }

        protected generateFieldDecl(fieldDecl: FieldDeclCodeDOM) {

            const mod = fieldDecl.isPublic() ? "public" : "private";

            if (fieldDecl.isInitialized()) {

                this.line(`${mod} ${fieldDecl.getName()}: ${fieldDecl.getType()} = ${fieldDecl.getInitialValueExpr()};`);

            } else {

                const undefinedType = fieldDecl.isInitInConstructor()? "" : "|undefined";

                this.line(`${mod} ${fieldDecl.getName()}: ${fieldDecl.getType()}${undefinedType};`);
            }
        }

        getMethodReturnDeclText(methodDecl: MethodDeclCodeDOM) {

            if (methodDecl.getReturnType()) {

                return ": " + methodDecl.getReturnType() + " ";
            }

            return " ";
        }

        // generateFieldInitInConstructor(classDecl: ClassDeclCodeDOM) {
        //     // nothing, in TypeScript fields are initialized in the declaration
        // }

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