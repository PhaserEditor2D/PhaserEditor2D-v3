namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponent {

        private _name: string;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._properties = new sceneobjects.UserProperties();
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            return {
                name: this._name,
                properties: propsData
            }
        }

        readJSON(data: any) {

            this._name = data.name;
            this._properties.readJSON(data.properties);
        }

        getName() {

            return this._name;
        }

        setName(name: string) {

            this._name = name;
        }

        getProperties() {

            return this._properties;
        }
    }
}