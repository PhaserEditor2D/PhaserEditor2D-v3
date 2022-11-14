namespace phasereditor2d.ide.core.code {

    export abstract class BaseCodeGenerator {

        private _text: string;
        private _replace: string;
        private _indent: number;

        constructor() {
            this._text = "";
            this._indent = 0;
        }

        formatVariableName(name: string) {

            return formatToValidVarName(name);
        }

        getOffset() {
            return this._text.length;
        }

        generate(replace: string): string {

            this._replace = replace ?? "";

            this.internalGenerate();

            this.cleanCode();

            return this._text;
        }

        protected abstract internalGenerate(): void;


        protected cleanCode() {

            // clean the empty lines

            const lines = this._text.split("\n").map(line => {

                if (line.trim() === "") {

                    return "";
                }

                return line;
            });

            this._text = lines.join("\n");
        }


        length() {

            return this._text.length;
        }

        getStartSectionContent(endTag: string, defaultContent: string) {

            const j = this._replace.indexOf(endTag);

            const size = this._replace.length;

            if (size > 0 && j !== -1) {

                const section = this._replace.substring(0, j);

                return section;
            }

            return defaultContent;
        }

        getSectionContent(openTag: string, closeTag: string, defaultContent: string) {

            const i = this._replace.indexOf(openTag);
            let j = this._replace.indexOf(closeTag);

            if (j === -1) {

                j = this._replace.length;
            }

            if (i !== -1 && j !== -1) {

                const section = this._replace.substring(i + openTag.length, j);

                return section;
            }

            return defaultContent;
        }

        getReplaceContent() {
            return this._replace;
        }

        userCode(text: string): void {

            const lines = text.split("\n");

            for (const line of lines) {

                this.line(line);
            }
        }

        public sectionStart(endTag: string, defaultContent: string) {

            this.append(this.getStartSectionContent(endTag, defaultContent));

            this.append(endTag);
        }

        public sectionEnd(openTag: string, defaultContent: string) {

            this.append(openTag);
            this.append(this.getSectionContent(openTag, "papa(--o^^o--)pig", defaultContent));
        }

        public section(openTag: string, closeTag: string, defaultContent: string) {

            const content = this.getSectionContent(openTag, closeTag, defaultContent);

            this.append(openTag);
            this.append(content);
            this.append(closeTag);
        }

        public cut(start: number, end: number) {

            const str = this._text.substring(start, end);

            const s1 = this._text.slice(0, start);
            const s2 = this._text.slice(end, this._text.length);

            this._text = s1 + s2;
            // _sb.delete(start, end);

            return str;
        }

        public trim(run: () => void) {

            const a = this.length();

            run();

            const b = this.length();

            const str = this._text.substring(a, b);

            if (str.trim().length === 0) {
                this.cut(a, b);
            }
        }

        append(str: string) {

            this._text += str;
        }

        join(list: string[]) {

            for (let i = 0; i < list.length; i++) {

                if (i > 0) {
                    this.append(", ");
                }

                this.append(list[i]);
            }
        }

        line(line = "") {

            this.append(line);
            this.append("\n");
            this.append(this.getIndentTabs());
        }

        lineIfNeeded() {

            if (!this.lastIsEmptyLine()) {

                this.line();
            }
        }

        lastIsEmptyLine() {

            let i = this._text.length - 1;
            let n = 0;

            while (i > 0) {

                const c = this._text[i];

                if (c === "\n") {

                    n++;
                }

                if (c.trim().length > 0) {

                    break;
                }

                i--;
            }

            return n > 1;
        }

        static escapeStringLiterals(str: string) {
            return str.replace("\\", "\\\\").replace("\\R", "\n").replace("'", "\\'").replace("\"", "\\\"");
        }

        openIndent(line = "") {

            this._indent++;
            this.line(line);
        }

        closeIndent(str = "") {

            this._indent--;

            const i = this._text.lastIndexOf("\n");

            if (i >= 0) {

                const last = this._text.substring(i);

                if (last.trim() === "") {
                    // removes the extra blank line
                    this._text = this._text.substring(0, i);
                }
            }

            this.line();
            this.line(str);
        }

        getIndentTabs() {

            return "\t".repeat(this._indent);
        }

        static emptyStringToNull(str: string) {

            return str == null ? null : (str.trim().length === 0 ? null : str);
        }
    }
}