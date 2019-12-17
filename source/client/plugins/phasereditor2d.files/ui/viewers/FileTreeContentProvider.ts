namespace phasereditor2d.files.ui.viewers {

    import controls = colibri.ui.controls;
    import core = colibri.core;
    import io = core.io;

    export class FileTreeContentProvider implements controls.viewers.ITreeContentProvider {

        private _onlyFolders : boolean;

        constructor(onlyFolders : boolean = false) {
            this._onlyFolders = onlyFolders;
        }

        getRoots(input: any): any[] {

            let result : io.FilePath[] = [];

            if (input instanceof core.io.FilePath) {
                
                if (this._onlyFolders) {
                    
                    if (!input.isFolder()) {
                        return [];
                    }
                }

                return [input];
            }

            if (input instanceof Array) {

                if (this._onlyFolders) {
                    return input.filter(f => (f as io.FilePath).isFolder());
                }
                
                return input;
            }

            return this.getChildren(input);
        }

        getChildren(parent: any): any[] {

            const files = (<core.io.FilePath>parent).getFiles();

            if (this._onlyFolders) {
                return files.filter(f => f.isFolder());
            }

            return files;
        }

    }
}