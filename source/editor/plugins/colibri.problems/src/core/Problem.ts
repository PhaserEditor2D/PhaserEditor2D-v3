namespace colibri.problems.core {

    export interface IProblemType {
        name: string;
        level: number;
    }

    export const PROBLEM_ERROR: IProblemType = { name: "Error", level: 0 };
    export const PROBLEM_WARNING: IProblemType = { name: "Warning", level: 1 };
    export const PROBLEM_INFO: IProblemType = { name: "Info", level: 2 };

    export class Problem {
        constructor(
            public type: IProblemType,
            public message: string,
            public file: colibri.core.io.FilePath,
            public data?: unknown,
        ) {

        }

        reveal() {

            return colibri.Platform.getWorkbench().openEditor(this.file);
        }
    }
}