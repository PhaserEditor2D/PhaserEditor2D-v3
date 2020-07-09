namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponent {

        private _name: string;
        private _gameObjectType: string;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._gameObjectType = "Phaser.GameObjects.Image";
            this._properties = new UserComponentProperties(this);
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            return {
                name: this._name,
                gameObjectType: this._gameObjectType,
                properties: propsData
            }
        }

        readJSON(data: any) {

            this._name = data.name;
            this._gameObjectType = data.gameObjectType || "Phaser.GameObjects.Image";
            this._properties.readJSON(data.properties);
        }

        getName() {

            return this._name;
        }

        setName(name: string) {

            this._name = name;
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