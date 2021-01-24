namespace colibri.core.io {

    export class FilePath {

        private _parent: FilePath;
        private _name: string;
        private _nameWithoutExtension: string;
        private _isFile: boolean;
        private _files: FilePath[];
        private _ext: string;
        private _modTime: number;
        private _fileSize: number;
        private _alive: boolean;

        constructor(parent: FilePath, fileData: IFileData) {

            this._parent = parent;
            this._isFile = fileData.isFile;
            this._fileSize = fileData.size;
            this._modTime = fileData.modTime;

            this._alive = true;

            this._setName(fileData.name);

            if (fileData.children) {

                this._files = [];

                for (const child of fileData.children) {
                    this._files.push(new FilePath(this, child));
                }

                this._sort();

            } else {

                this._files = [];

            }
        }

        _sort() {
            this._files.sort((a, b) => {

                const a1 = a._isFile ? 1 : 0;
                const b1 = b._isFile ? 1 : 0;

                if (a1 === b1) {
                    return a._name.localeCompare(b._name);
                }

                return a1 - b1;
            });
        }

        _setName(name: string) {

            this._name = name;

            const i = this._name.lastIndexOf(".");

            if (i >= 0) {

                this._ext = this._name.substring(i + 1);
                this._nameWithoutExtension = this._name.substring(0, i);

            } else {

                this._ext = "";
                this._nameWithoutExtension = this._name;
            }
        }

        getExtension() {
            return this._ext;
        }

        getSize(): number {

            if (this.isFile()) {
                return this._fileSize;
            }

            let size = 0;

            for (const file of this.getFiles()) {
                size += file.getSize();
            }

            return size;
        }

        _setSize(size: number) {
            this._fileSize = size;
        }

        getName() {
            return this._name;
        }

        getNameWithoutExtension() {
            return this._nameWithoutExtension;
        }

        getModTime() {
            return this._modTime;
        }

        _setModTime(modTime: number) {
            this._modTime = modTime;
        }

        getFullName(): string {

            if (this._parent) {
                return this._parent.getFullName() + "/" + this._name;
            }

            return this._name;
        }

        getProjectRelativeName(): string {

            if (this._parent) {

                return this._parent.getProjectRelativeName() + "/" + this._name;
            }

            return "";
        }

        getUrl(): string {

            if (this._parent) {

                const url = this._parent.getUrl() + "/" + this._name;

                if (this.isFile()) {

                    return url + "?m=" + this._modTime;
                }

                return url;
            }

            const projectName = this.getProject().getName();

            return `./project/${projectName}`;
        }

        getExternalUrl() {

            if (this._parent) {
                return this._parent.getExternalUrl() + "/" + this._name;
            }

            const projectName = this.getProject().getName();

            return `./external/${projectName}`;
        }

        getProject(): FilePath {

            if (this._parent) {
                return this._parent.getProject();
            }

            return this;
        }

        getSibling(name: string) {

            const parent = this.getParent();

            if (parent) {

                return parent.getFile(name);
            }

            return null;
        }

        getFile(name: string) {
            return this.getFiles().find(file => file.getName() === name);
        }

        getParent() {
            return this._parent;
        }

        isFile() {
            return this._isFile;
        }

        isFolder() {
            return !this.isFile();
        }

        getFiles() {
            return this._files;
        }

        _setAlive(alive: boolean) {
            this._alive = alive;
        }

        isAlive() {
            return this._alive;
        }

        visit(visitor: (file: FilePath) => void) {

            visitor(this);

            for (const file of this._files) {

                file.visit(visitor);
            }
        }

        _add(file: FilePath) {

            file._remove();

            file._parent = this;

            this._files.push(file);

            this._sort();
        }

        _remove() {

            this._alive = false;

            if (this._parent) {

                const list = this._parent._files;
                const i = list.indexOf(this);

                if (i >= 0) {
                    list.splice(i, 1);
                }
            }
        }

        flatTree(files: FilePath[], includeFolders: boolean): FilePath[] {

            if (this.isFolder()) {

                if (includeFolders) {
                    files.push(this);
                }

                for (const file of this.getFiles()) {
                    file.flatTree(files, includeFolders);
                }

            } else {

                files.push(this);

            }

            return files;
        }

        toString() {

            if (this._parent) {

                return this._parent.toString() + "/" + this._name;
            }

            return this._name;
        }

        toStringTree() {

            return this.toStringTree2(0);
        }

        private toStringTree2(depth: number) {

            let s = " ".repeat(depth * 4);

            s += this.getName() + (this.isFolder() ? "/" : "") + "\n";

            if (this.isFolder()) {

                for (const file of this._files) {

                    s += file.toStringTree2(depth + 1);
                }

            }

            return s;
        }
    }
}