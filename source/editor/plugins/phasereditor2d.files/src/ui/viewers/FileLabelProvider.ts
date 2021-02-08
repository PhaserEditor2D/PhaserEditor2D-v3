namespace phasereditor2d.files.ui.viewers {

    import viewers = colibri.ui.controls.viewers;
    import io = colibri.core.io;

    export class FileLabelProvider implements viewers.ILabelProvider {

        private _folderFullPath: boolean;

        constructor(folderFullPath = false) {

            this._folderFullPath = folderFullPath;
        }

        getLabel(file: io.FilePath): string {

            if (this._folderFullPath && file.isFolder()) {

                return file.getProjectRelativeName();
            }

            return file.getName();
        }
    }
}