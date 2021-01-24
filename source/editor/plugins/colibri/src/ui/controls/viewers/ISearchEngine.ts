namespace colibri.ui.controls.viewers {

    export interface IMatchResult {
        start?: number;
        end?: number;
        measureStart?: string;
        measureMatch?: string;
        matches: boolean;
    }

    export interface ISearchEngine {

        prepare(pattern: string): void;

        matches(text: string): IMatchResult;
    }
}