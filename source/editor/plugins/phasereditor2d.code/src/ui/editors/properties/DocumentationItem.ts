namespace phasereditor2d.code.ui.editors.properties {

    export class DocumentationItem {

        private _data: any;
        private _converter: any;

        constructor(data: any) {

            this._data = data;

            this._converter = new window["showdown"].Converter();
        }

        getData() {
            return this._data;
        }

        toHTML() {

            if (this._data.documentation) {

                const docs = this._data.documentation.map(doc => doc.text).join("\n");

                const html = this._converter.makeHtml(docs);

                return html;
            }

            return "";
        }
    }
}