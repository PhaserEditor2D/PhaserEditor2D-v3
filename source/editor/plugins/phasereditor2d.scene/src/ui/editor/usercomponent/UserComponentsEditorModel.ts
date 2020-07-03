namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentsEditorModel {

        private _scripts: UserComponent[];

        constructor() {

            this._scripts = [];
        }

        toJSON() {

            return {
                scripts: this._scripts.map(script => script.toJSON()),
                meta: {
                    app: "Phaser Editor 2D - Object Script Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            }
        }

        readJSON(data: any) {

            this._scripts = data.scripts.map(
                scriptData => {

                    const script = new UserComponent(scriptData.name);
                    script.readJSON(scriptData);

                    return script;
                }
            );
        }

        getScripts() {

            return this._scripts;
        }
    }
}