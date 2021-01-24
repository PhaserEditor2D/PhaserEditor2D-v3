namespace colibri.ui.controls.viewers {

    export class SingleWordSearchEngine implements ISearchEngine {

        private _pattern: string;

        prepare(pattern: string): void {

            this._pattern = pattern.toLowerCase();
        }

        matches(text: string): IMatchResult {

            if (this._pattern.length === 0) {

                return {
                    matches: false
                };
            }

            const index = text.toLowerCase().indexOf(this._pattern);

            if (index >= 0) {

                return {
                    start: index,
                    end: index + this._pattern.length,
                    matches: true,
                    measureMatch: text.substring(index, index + this._pattern.length),
                    measureStart: text.substring(0, index)
                };
            }

            return {
                matches: false
            };
        }
    }
}