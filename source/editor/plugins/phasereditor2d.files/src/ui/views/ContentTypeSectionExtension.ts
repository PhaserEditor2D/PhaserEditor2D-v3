namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;

    export interface IContentTypeSectionAssoc {

        contentType: string,
        section: string;
    }

    export class ContentTypeSectionExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.views.ContentTypeSectionExtension";

        private _assoc: IContentTypeSectionAssoc[];

        static withContentType(contentType: string, ...sections: string[]) {

            return new ContentTypeSectionExtension(...sections.map(section => ({ contentType, section })));
        }

        static withSection(section: string, ...contentTypes: string[]) {

            return new ContentTypeSectionExtension(...contentTypes.map(contentType => ({ contentType, section })));
        }

        constructor(...assoc: IContentTypeSectionAssoc[]) {
            super(ContentTypeSectionExtension.POINT_ID);

            this._assoc = assoc;
        }

        isContentTypeSupportedBySection(contentType: string, section: string) {

            const assoc = this._assoc.find(a => a.contentType === contentType && a.section === section);

            return assoc !== undefined;
        }
    }
}