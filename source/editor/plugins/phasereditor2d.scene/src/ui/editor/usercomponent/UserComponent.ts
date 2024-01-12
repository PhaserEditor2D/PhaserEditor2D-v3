namespace phasereditor2d.scene.ui.editor.usercomponent {

    import read = colibri.core.json.read;

    export class UserComponent {

        private _name: string;
        private _displayName: string;
        private _objectDisplayFormat: string;
        private _baseClass: string;
        private _gameObjectType: string;
        private _properties: sceneobjects.UserPropertiesManager;

        constructor(name: string) {

            this._name = name;
            this._baseClass = "";
            this._displayName = "";
            this._objectDisplayFormat = "";
            this._gameObjectType = "Phaser.GameObjects.Image";
            this._properties = new UserComponentProperties(this);
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            const data = {
                name: this._name,
                displayName: this._displayName,
                objectDisplayFormat: this._objectDisplayFormat,
                baseClass: this._baseClass,
                gameObjectType: this._gameObjectType,
                properties: propsData
            };

            return data;
        }

        readJSON(data: any) {

            this._name = data.name;
            this._displayName = read(data, "displayName", "");
            this._objectDisplayFormat = read(data, "objectDisplayFormat", "");
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

        getObjectDisplayFormat() {

            return this._objectDisplayFormat;
        }

        setObjectDisplayFormat(objectDisplayFormat: string) {

            this._objectDisplayFormat = objectDisplayFormat;
        }

        getDisplayName() {

            return this._displayName;
        }

        setDisplayName(displayName: string) {

            this._displayName = displayName;
        }

        getDisplayNameOrName() {

            if (this._displayName && this._displayName.trim().length > 0) {

                return this._displayName;
            }

            return this._name;
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