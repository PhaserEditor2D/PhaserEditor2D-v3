namespace phasereditor2d.scene.core.code {

    export class CodeDOM {

        private _offset: number;

        getOffset() {
            return this._offset;
        }

        setOffset(offset: number) {
            this._offset = offset;
        }

        static isBlankLine(codeDom: CodeDOM) {
            if (codeDom instanceof RawCodeDOM) {

                const code = codeDom.getCode();

                return code === "";
            }

            return false;
        }

        static removeBlankLines<T extends CodeDOM>(list: T[]) {

            const list2 = [];

            let lastIsBlankLine = false;

            for (const item of list) {

                if (this.isBlankLine(item)) {

                    if (lastIsBlankLine) {

                        continue;
                    }

                    lastIsBlankLine = true;

                } else {

                    lastIsBlankLine = false;
                }

                list2.push(item);
            }

            return list2;
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

            return result;
        }
    }
}