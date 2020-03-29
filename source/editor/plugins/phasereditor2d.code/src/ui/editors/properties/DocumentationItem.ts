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

            let html = "";

            if (this._data.displayParts) {

                const line = this._data.displayParts.map(p => {

                    if (p.kind === "methodName" || p.kind === "parameterName" || p.kind === "className") {

                        return `<b>${p.text}</b>`;
                    }

                    return p.text;

                }).join("");

                html += `<code>${line}</code><br>`;
            }

            if (this._data.documentation) {

                const docs = this._data.documentation.map(doc => doc.text).join("\n");

                html += this._converter.makeHtml(docs);
            }

            if (this._data.tags) {

                const tags = this._data.tags
                    .map(t => "<p><b><code>@" + t.name + "</code></b> " + t.text + "</p>").join("");

                html += tags;
            }

            return html;
        }
    }
}