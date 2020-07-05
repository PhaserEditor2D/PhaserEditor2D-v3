namespace phasereditor2d.scene.ui.editor.usercomponent {

    import code = core.code;

    export class UserComponentCodeDOMBuilder {

        private _component: UserComponent;

        constructor(component: UserComponent) {

            this._component = component;
        }

        build(): code.UnitCodeDOM {

            const unitDom = new code.UnitCodeDOM([]);

            const clsDom = this.createClass();

            unitDom.getBody().push(clsDom);

            return unitDom;
        }

        private createClass() {

            const clsDom = new code.ClassDeclCodeDOM(this._component.getName());

            if (this._component.getSuperClass().trim().length > 0) {

                clsDom.setSuperClass(this._component.getSuperClass());
            }

            this.buildConstructor(clsDom);

            this.buildFields(clsDom);

            this.buildGetSetCompMethods(clsDom);

            return clsDom;
        }

        private buildConstructor(clsDom: code.ClassDeclCodeDOM) {

            const ctrDeclDom = new code.MethodDeclCodeDOM("constructor");

            ctrDeclDom.arg("gameObject", this._component.getGameObjectType());

            const setCompCallDom = new code.MethodCallCodeDOM("setComponent", clsDom.getName());
            setCompCallDom.arg("gameObject");
            setCompCallDom.arg("this");
            ctrDeclDom.getBody().push(setCompCallDom);

            clsDom.getBody().push(ctrDeclDom);
        }

        private buildFields(clsDom: code.ClassDeclCodeDOM) {

            // gameObject field

            const gameObjDeclDom = new code.FieldDeclCodeDOM("gameObject", this._component.getGameObjectType());
            gameObjDeclDom.setInitialValueExpr("gameObject");
            clsDom.getBody().push(gameObjDeclDom);

            // props fields

            const userProps = this._component.getUserProperties();

            for (const prop of userProps.getProperties()) {

                const decls = prop.buildDeclarationsCode();

                clsDom.getBody().push(...decls);
            }
        }

        private buildGetSetCompMethods(clsDom: code.ClassDeclCodeDOM) {
            {
                // getComponent()

                const declDom = new code.MethodDeclCodeDOM("getComponent");
                declDom.getModifiers().push("static");
                declDom.arg("gameObject", this._component.getGameObjectType());
                declDom.setReturnType(clsDom.getName());

                const returnDom = new code.RawCodeDOM(`return gameObject["__${clsDom.getName()}"];`)

                declDom.getBody().push(returnDom);

                clsDom.getBody().push(declDom);
            }

            {
                // setComponent()

                const compVarName = clsDom.getName().substring(0, 1).toLowerCase() + clsDom.getName().substring(1)

                const declDom = new code.MethodDeclCodeDOM("setComponent");
                declDom.getModifiers().push("static");
                declDom.arg("gameObject", this._component.getGameObjectType());
                declDom.arg(compVarName, this._component.getName());

                const setInstrDom = new code.RawCodeDOM(`gameObject["__${clsDom.getName()}"] = ${compVarName};`)

                declDom.getBody().push(setInstrDom);

                clsDom.getBody().push(declDom);
            }

            {
                // hasComponent()

                const declDom = new code.MethodDeclCodeDOM("hasComponent");
                declDom.getModifiers().push("static");
                declDom.arg("gameObject", this._component.getGameObjectType());

                const returnDom = new code.RawCodeDOM(`return "__${clsDom.getName()}" in gameObject;`)

                declDom.getBody().push(returnDom);

                clsDom.getBody().push(declDom);
            }
        }
    }
}