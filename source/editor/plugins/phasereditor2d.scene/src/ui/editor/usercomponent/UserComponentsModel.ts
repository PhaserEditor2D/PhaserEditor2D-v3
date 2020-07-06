namespace phasereditor2d.scene.ui.editor.usercomponent {

    export interface IUserComponentsEditorModelData {
        components: any[],
        outputLang: core.json.SourceLang,
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    }

    export class UserComponentsModel {

        private _components: UserComponent[];
        private _outputLang: core.json.SourceLang;

        constructor() {

            this._components = [];
            this._outputLang = core.json.SourceLang.JAVA_SCRIPT;
        }

        toJSON(): IUserComponentsEditorModelData {

            return {
                components: this._components.map(comp => comp.toJSON()),
                outputLang: this._outputLang,
                meta: {
                    app: "Phaser Editor 2D - Object Script Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            }
        }

        readJSON(data: IUserComponentsEditorModelData) {

            this._outputLang = data.outputLang || core.json.SourceLang.JAVA_SCRIPT;

            this._components = data.components.map(
                userCompData => {

                    const userComp = new UserComponent(userCompData.name);
                    userComp.readJSON(userCompData);

                    return userComp;
                }
            );
        }

        getOutputLang() {

            return this._outputLang;
        }

        setOutputLang(outputLang: core.json.SourceLang) {

            this._outputLang = outputLang;
        }

        getComponents() {

            return this._components;
        }

        setComponents(components: UserComponent[]) {

            this._components = components;
        }
    }
}