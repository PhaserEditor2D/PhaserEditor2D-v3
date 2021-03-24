namespace phasereditor2d.scene.ui.editor.usercomponent {

    import code = core.code;
    import io = colibri.core.io;

    export class UserComponentCodeDOMBuilder {

        private _component: UserComponent;
        private _model: UserComponentsModel;
        private _file: io.FilePath;

        constructor(component: UserComponent, model: UserComponentsModel, file: io.FilePath) {

            this._component = component;
            this._model = model;
            this._file = file;
        }

        build(): code.UnitCodeDOM {

            const unitDom = new code.UnitCodeDOM([]);

            const clsDom = this.createClass();

            unitDom.getBody().push(clsDom);

            return unitDom;
        }

        private createClass() {

            const clsDom = new code.ClassDeclCodeDOM(this._component.getName());

            clsDom.setExportClass(this._model.isExportClass());
            clsDom.setSuperClass(this._component.getBaseClass());

            this.buildConstructor(clsDom);

            this.buildFields(clsDom);

            this.buildAccessorMethods(clsDom);

            return clsDom;
        }

        private buildConstructor(clsDom: code.ClassDeclCodeDOM) {

            const ctrDeclDom = new code.MethodDeclCodeDOM("constructor");

            ctrDeclDom.arg("gameObject", this._component.getGameObjectType());

            const body = ctrDeclDom.getBody();

            const superClass = this._component.getBaseClass();

            if (superClass && superClass.trim() !== "") {

                body.push(new code.RawCodeDOM("super(gameObject);"));
                body.push(new code.RawCodeDOM(""));
            }

            const setCompDom = new code.RawCodeDOM(`gameObject["__${clsDom.getName()}"] = this;`);
            body.push(setCompDom);

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

        private buildAccessorMethods(clsDom: code.ClassDeclCodeDOM) {
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
        }
    }
}