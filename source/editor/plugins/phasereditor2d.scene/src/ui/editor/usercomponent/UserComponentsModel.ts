namespace phasereditor2d.scene.ui.editor.usercomponent {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export interface IUserComponentsModelData {
        components: any[],
        outputLang?: ide.core.code.SourceLang,
        exportClass?: boolean,
        autoImport?: boolean,
        insertSpaces?: boolean,
        tabSize?: number,
        meta: {
            app: string,
            url: string,
            contentType: string
        }
    }

    export class UserComponentsModel {

        private _components: UserComponent[];
        public outputLang: ide.core.code.SourceLang;
        public javaScriptInitFieldsInConstructor: boolean;
        public insertSpaces: boolean;
        public tabSize: number;
        public exportClass: boolean;
        public autoImport: boolean;

        constructor() {

            this._components = [];
            this.outputLang = ide.core.code.SourceLang.JAVA_SCRIPT;
            this.javaScriptInitFieldsInConstructor = false;
            this.insertSpaces = false;
            this.tabSize = 4;
            this.exportClass = false;
            this.autoImport = false;
        }

        toJSON(): IUserComponentsModelData {

            const data = {
                components: this._components.map(comp => comp.toJSON()),
                meta: {
                    app: "Phaser Editor 2D - User Components Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_USER_COMPONENTS
                }
            };

            write(data, "outputLang", this.outputLang, ide.core.code.SourceLang.JAVA_SCRIPT);
            write(data, "javaScriptInitFieldsInConstructor", this.javaScriptInitFieldsInConstructor, false);
            write(data, "insertSpaces", this.insertSpaces, false);
            write(data, "tabSize", this.tabSize, 4);
            write(data, "exportClass", this.exportClass, false);
            write(data, "autoImport", this.autoImport, false);

            return data;
        }

        readJSON(data: IUserComponentsModelData) {

            this.outputLang = read(data, "outputLang", ide.core.code.SourceLang.JAVA_SCRIPT);
            this.javaScriptInitFieldsInConstructor = read(data, "javaScriptInitFieldsInConstructor", false);
            this.insertSpaces = read(data, "insertSpaces", false);
            this.tabSize = read(data, "tabSize", 4);
            this.exportClass = read(data, "exportClass", false);
            this.autoImport = read(data, "autoImport", false);

            this._components = data.components.map(
                userCompData => {

                    const userComp = new UserComponent(userCompData.name);
                    userComp.readJSON(userCompData);

                    return userComp;
                }
            );
        }

        getOutputLang() {

            return this.outputLang;
        }

        setOutputLang(outputLang: ide.core.code.SourceLang) {

            this.outputLang = outputLang;
        }

        getComponents() {

            return this._components;
        }

        setComponents(components: UserComponent[]) {

            this._components = components;
        }
    }
}