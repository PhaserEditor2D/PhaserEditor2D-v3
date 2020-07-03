namespace phasereditor2d.scene.ui.editor.usercomponent {

    export interface IUserComponentsEditorModelData {
        components: any[],
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    }

    export class UserComponentsEditorModel {

        private _components: UserComponent[];

        constructor() {

            this._components = [];
        }

        toJSON(): IUserComponentsEditorModelData {

            return {
                components: this._components.map(script => script.toJSON()),
                meta: {
                    app: "Phaser Editor 2D - Object Script Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            }
        }

        readJSON(data: IUserComponentsEditorModelData) {

            this._components = data.components.map(
                userCompData => {

                    const userComp = new UserComponent(userCompData.name);
                    userComp.readJSON(userCompData);

                    return userComp;
                }
            );
        }

        getComponents() {

            return this._components;
        }

        setComponents(components: UserComponent[]) {

            this._components = components;
        }
    }
}