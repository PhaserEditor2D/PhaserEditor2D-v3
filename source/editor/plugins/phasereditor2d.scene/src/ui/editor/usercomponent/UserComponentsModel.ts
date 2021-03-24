namespace phasereditor2d.scene.ui.editor.usercomponent {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export interface IUserComponentsModelData {
        components: any[],
        outputLang?: core.json.SourceLang,
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
        private _outputLang: core.json.SourceLang;
        private _insertSpaces: boolean;
        private _tabSize: number;
        private _exportClass: boolean;
        private _autoImport: boolean;

        constructor() {

            this._components = [];
            this._outputLang = core.json.SourceLang.JAVA_SCRIPT;
            this._insertSpaces = false;
            this._tabSize = 4;
            this._exportClass = false;
            this._autoImport = false;
        }

        getTabSize() {

            return this._tabSize;
        }

        setTabSize(tabSize: number) {

            this._tabSize = tabSize;
        }

        isInsertSpaces() {

            return this._insertSpaces;
        }

        setInsetSpaces(insertSpaces: boolean) {

            this._insertSpaces = insertSpaces;
        }

        isExportClass() {

            return this._exportClass;
        }

        setExportClass(exportClass: boolean) {

            this._exportClass = exportClass;
        }

        isAutoImport() {

            return this._autoImport;
        }

        setAutoImport(autoImport: boolean) {

            this._autoImport = autoImport;
        }

        toJSON(): IUserComponentsModelData {

            const data = {
                components: this._components.map(comp => comp.toJSON()),
                meta: {
                    app: "Phaser Editor 2D - Object Script Editor",
                    url: "https://phasereditor2d.com",
                    contentType: scene.core.CONTENT_TYPE_SCENE
                }
            };

            write(data, "outputLang", this._outputLang, core.json.SourceLang.JAVA_SCRIPT);
            write(data, "insertSpaces", this._insertSpaces, false);
            write(data, "tabSize", this._tabSize, 4);
            write(data, "exportClass", this._exportClass, false);
            write(data, "autoImport", this._autoImport, false);

            return data;
        }

        readJSON(data: IUserComponentsModelData) {

            this._outputLang = read(data, "outputLang", core.json.SourceLang.JAVA_SCRIPT);
            this._insertSpaces = read(data, "insertSpaces", false);
            this._tabSize = read(data, "tabSize", 4);
            this._exportClass = read(data, "exportClass", false);
            this._autoImport = read(data, "autoImport", false);

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