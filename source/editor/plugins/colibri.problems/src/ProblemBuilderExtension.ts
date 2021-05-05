namespace colibri.problems {

    import io = colibri.core.io;

    export abstract class ProblemBuilderExtension extends colibri.Extension {

        static POINT_ID = "colibri.problems.ProblemBuilderExtension";
        private _contentType: string;

        constructor(contentType?: string) {
            super(ProblemBuilderExtension.POINT_ID);

            this._contentType = contentType;
        }

        getContentType() {

            return this._contentType;
        }

        async acceptsFile(file: io.FilePath): Promise<boolean> {

            const ct = await Platform.getWorkbench().getContentTypeRegistry().preloadAndGetContentType(file);

            return ct === this._contentType;
        }

        abstract build(files: io.FilePath[]): Promise<core.Problem[]>;
    }
}