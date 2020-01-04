namespace phasereditor2d.scene.core {

    export class CodeDOM {

        private _offset: number;

        getOffset() {
            return this._offset;
        }

        setOffset(offset: number) {
            this._offset = offset;
        }

        static toHex(n: number) {

            const hex = n.toString(16);

            if (hex.length < 2) {
                return "0" + hex;
            }

            return hex;
        }

        static quote(s: string): string {

            if (s === null || s === undefined || s.length === 0) {
                return '""';
            }

            let b: string;
            let c: string;

            let i: number;
            const len = s.length;

            let result = '"';

            for (i = 0; i < len; i += 1) {
                b = c;
                c = s.charAt(i);

                switch (c) {

                    case "\\":
                    case '"':
                        result += "\\";
                        result += c;
                        break;

                    case "/":
                        if (b === "<") {
                            result += "\\";
                        }

                        result += c;

                        break;

                    case "\b":
                        result += "\\b";
                        break;

                    case "\t":
                        result += "\\t";
                        break;

                    case "\n":
                        result += "\\n";
                        break;

                    case "\f":
                        result += "\\f";
                        break;

                    case "\r":
                        result += "\\r";
                        break;

                    default:
                        result += c;
                }
            }

            result += '"';

            return s;
        }
    }
}