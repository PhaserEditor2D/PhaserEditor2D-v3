namespace phasereditor2d.scene.core.code {

    export class UserSectionCodeDOM extends CodeDOM {

        private _openTag: string;
        private _closeTag: string;
        private _defaultContent: string;

        constructor(openTag: string, closeTag: string, userContent: string) {
            super();

            this._openTag = openTag;
            this._closeTag = closeTag;
            this._defaultContent = userContent;
        }

        getOpenTag() {

            return this._openTag;
        }

        getCloseTag() {

            return this._closeTag;
        }

        getDefaultContent() {

            return this._defaultContent;
        }
    }
}