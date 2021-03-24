namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponent {

        private _name: string;
        private _baseClass: string;
        private _gameObjectType: string;
        private _properties: sceneobjects.UserProperties;
        private _listenStart: boolean;
        private _listenUpdate: boolean;
        private _listenDestroy: boolean;

        constructor(name: string) {

            this._name = name;
            this._baseClass = "";
            this._gameObjectType = "Phaser.GameObjects.Image";
            this._properties = new UserComponentProperties(this);
            this._listenStart = false;
            this._listenUpdate = false;
            this._listenDestroy = false;
        }

        isListenStart() {

            return this._listenStart;
        }

        setListenStart(listenStart: boolean) {

            this._listenStart = listenStart;
        }

        isListenUpdate() {

            return this._listenUpdate;
        }

        setListenUpdate(listenUpdate: boolean) {

            this._listenUpdate = listenUpdate;
        }

        isListenDestroy() {

            return this._listenDestroy;
        }

        setListenDestroy(listenDestroy: boolean) {

            this._listenDestroy = listenDestroy;
        }

        toJSON(): any {

            const propsData = [];
            this._properties.writeJSON(propsData);

            return {
                name: this._name,
                baseClass: this._baseClass,
                gameObjectType: this._gameObjectType,
                properties: propsData,
                listenStart: this._listenStart,
                listenUpdate: this._listenUpdate,
                listenDestroy: this._listenDestroy
            }
        }

        readJSON(data: any) {

            this._name = data.name;
            this._baseClass = data.baseClass || "";
            this._gameObjectType = data.gameObjectType || "Phaser.GameObjects.Image";
            this._listenStart = data.listenStart || false;
            this._listenUpdate = data.listenUpdate || false;
            this._listenDestroy = data.listenDestroy || false;
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