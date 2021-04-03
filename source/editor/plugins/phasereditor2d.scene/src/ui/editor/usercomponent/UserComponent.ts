namespace phasereditor2d.scene.ui.editor.usercomponent {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export class UserComponent {

        private _name: string;
        private _baseClass: string;
        private _gameObjectType: string;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._baseClass = "";
            this._gameObjectType = "Phaser.GameObjects.Image";
            this._properties = new UserComponentProperties(this);
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            const data = {
                name: this._name,
                baseClass: this._baseClass,
                gameObjectType: this._gameObjectType,
                properties: propsData
            };

            return data;
        }

        readJSON(data: any) {

            this._name = data.name;
            this._baseClass = read(data, "baseClass", "");
            this._gameObjectType = read(data, "gameObjectType", "Phaser.GameObjects.Image");
            this._properties.readJSON(data.properties);
        }

        getName() {

            return this._name;
        }

        setName(name: string) {

            this._name = name;
        }

        getBaseClass() {

            return this._baseClass;
        }

        setBaseClass(baseClass: string) {

            this._baseClass = baseClass;
        }

        getGameObjectType() {

            return this._gameObjectType;
        }

        setGameObjectType(gameObjectType: string) {

            this._gameObjectType = gameObjectType;
        }

        getUserProperties() {

            return this._properties;
        }
    }
}