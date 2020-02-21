namespace phasereditor2d.ide.core {

    import io = colibri.core.io;

    export class MultiHashBuilder {

        private _tokens: Set<string>;

        constructor() {

            this._tokens = new Set();
        }

        addPartialToken(token: string) {

            if (token && token !== "") {

                this._tokens.add(token);
            }
        }

        addPartialFileToken(file: io.FilePath) {

            if (file) {

                this.addPartialToken("file(" + file.getFullName() + "," + file.getModTime() + ")");
            }
        }

        build() {

            const list = [];

            for (const token of this._tokens) {

                list.push(token);
            }

            return list.sort().join("+");
        }
    }
}