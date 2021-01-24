namespace colibri.ui.controls.viewers {

    export class MultiWordSearchEngine implements ISearchEngine {

        private _words: string[];

        prepare(pattern: string): void {

            this._words = pattern.split(" ").map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
        }

        matches(text: string): IMatchResult {

            if (this._words.length === 0) {

                return {
                    matches: false
                };
            }

            const input = text.toLowerCase();

            let i = 0;
            let start: number;
            let end: number;

            for (const world of this._words) {

                const k = input.indexOf(world, i);

                if (k >= 0) {

                    if (start === undefined) {

                        start = k;
                    }

                    end = k + world.length;

                    i = end + 1;

                } else {

                    return { matches: false };
                }
            }

            return {
                start,
                end,
                matches: true,
                measureMatch: text.substring(start, end),
                measureStart: text.substring(0, start)
            };
        }
    }
}