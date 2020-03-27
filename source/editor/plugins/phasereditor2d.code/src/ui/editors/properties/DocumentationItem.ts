namespace phasereditor2d.code.ui.editors.properties {

    export class DocumentationItem {

        private _data: any;

        constructor(data: any) {

            this._data = data;
        }

        getData() {
            return this._data;
        }

        toHTML() {

            const docs = this._data.documentation.map(doc => doc.text).join("\n");

            return docs;
        }
    }
}