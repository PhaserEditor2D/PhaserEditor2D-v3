namespace phasereditor2d.scene.ui.editor.scripts {

    enum ObjectScriptTarget {
        OBJECT,
        OBJECT_LIST
    }

    export class ObjectScript {

        private _name: string;
        private _returnType: string;
        private _target: ObjectScriptTarget;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._target = ObjectScriptTarget.OBJECT;
            this._properties = new sceneobjects.UserProperties();
        }

        getName() {

            return this._name;
        }

        setName(name: string) {

            this._name = name;
        }

        getTarget() {

            return this._target;
        }

        setTarget(target: ObjectScriptTarget) {

            this._target = target;
        }

        getReturnType() {

            return this._returnType;
        }

        setReturnType(returnType: string) {

            this._returnType = returnType;
        }

        getProperties() {

            return this._properties;
        }
    }
}