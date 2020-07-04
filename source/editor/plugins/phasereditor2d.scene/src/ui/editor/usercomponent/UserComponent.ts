namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponent {

        private _name: string;
        private _superClass: string;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._superClass = "";
            this._properties = new sceneobjects.UserProperties();
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            return {
                name: this._name,
                superClass: this._superClass,
                properties: propsData
            }
        }

        readJSON(data: any) {

            this._name = data.name;
            this._superClass = data.superClass || "";
            this._properties.readJSON(data.properties);
        }

        getName() {

            return this._name;
        }

        setName(name: string) {

            this._name = name;
        }

        getSuperClass() {

            return this._superClass;
        }

        setSuperClass(baseClass: string) {

            this._superClass = baseClass;
        }

        getProperties() {

            return this._properties;
        }
    }
}