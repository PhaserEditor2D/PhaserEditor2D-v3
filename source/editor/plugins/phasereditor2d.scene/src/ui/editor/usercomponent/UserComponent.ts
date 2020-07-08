namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponent {

        private _name: string;
        private _superClass: string;
        private _gameObjectType: string;
        private _properties: sceneobjects.UserProperties;

        constructor(name: string) {

            this._name = name;
            this._superClass = "";
            this._gameObjectType = "Phaser.GameObjects.Image";
            this._properties = new UserComponentProperties(this);
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            return {
                name: this._name,
                superClass: this._superClass,
                gameObjectType: this._gameObjectType,
                properties: propsData
            }
        }

        readJSON(data: any) {

            this._name = data.name;
            this._superClass = data.superClass || "";
            this._gameObjectType = data.gameObjectType || "Phaser.GameObjects.Image";
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