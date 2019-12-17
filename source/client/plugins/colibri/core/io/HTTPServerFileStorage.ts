namespace colibri.core.io {

    export async function apiRequest(method: string, body?: any) {
        try {

            const resp = await fetch("api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "method": method,
                    "body": body
                })
            });

            const json = await resp.json();

            return json;

        } catch (e) {

            console.error(e);

            return new Promise((resolve, reject) => {
                resolve({
                    error: e.message
                });
            });
        }
    }

    export class FileStorage_HTTPServer implements IFileStorage {

        private _root: FilePath;
        private _changeListeners: ChangeListenerFunc[];
        private _projectName: string;

        constructor() {

            this._root = null;

            this._changeListeners = [];

        }

        addChangeListener(listener: ChangeListenerFunc) {
            this._changeListeners.push(listener);
        }

        removeChangeListener(listener: ChangeListenerFunc) {

            const i = this._changeListeners.indexOf(listener);

            this._changeListeners.splice(i, 1);
        }

        getRoot(): FilePath {
            return this._root;
        }

        async openProject(projectName: string): Promise<FilePath> {

            this._projectName = projectName;

            await this.reload();

            return this.getRoot();
        }

        async getProjectTemplates(): Promise<ProjectTemplatesData> {

            const data = await apiRequest("GetProjectTemplates", {});

            if (data.error) {

                alert("Cannot get the project templates");

                return {
                    providers: []
                };
            }

            return data["templatesData"];
        }

        async createProject(templatePath: string, projectName: string): Promise<boolean> {

            const data = await apiRequest("CreateProject", {
                templatePath: templatePath,
                projectName: projectName
            });

            if (data.error) {

                alert("Cannot create the project.");

                return false;
            }

            return true;
        }

        async reload(): Promise<void> {

            const data = await apiRequest("GetProjectFiles", {
                project: this._projectName
            });

            const oldRoot = this._root;

            let newRoot: FilePath;

            if (data.projectNumberOfFiles > data.maxNumberOfFiles) {

                newRoot = new FilePath(null, {
                    name: this._projectName,
                    modTime: 0,
                    size: 0,
                    children: [],
                    isFile: false
                });

                alert(`Your project exceeded the maximum number of files allowed (${data.projectNumberOfFiles} > ${data.maxNumberOfFiles})`);

            } else {

                newRoot = new FilePath(null, data.rootFile);
            }

            this._root = newRoot;

            if (oldRoot) {

                const change = FileStorage_HTTPServer.compare(oldRoot, newRoot);

                this.fireChange(change);
            }
        }

        private fireChange(change: FileStorageChange) {

            for (const listener of this._changeListeners) {
                try {
                    listener(change);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        private static compare(oldRoot: FilePath, newRoot: FilePath): FileStorageChange {

            const oldFiles: FilePath[] = [];
            const newFiles: FilePath[] = [];

            oldRoot.flatTree(oldFiles, false);
            newRoot.flatTree(newFiles, false);

            const newNameMap = new Map<string, FilePath>();

            for (const file of newFiles) {
                newNameMap.set(file.getFullName(), file);
            }

            const newNameSet = new Set(newFiles.map(file => file.getFullName()));
            const oldNameSet = new Set(oldFiles.map(file => file.getFullName()));

            const deleted = [];
            const modified = [];
            const added = [];

            for (const oldFile of oldFiles) {

                const oldName = oldFile.getFullName();

                if (newNameSet.has(oldName)) {

                    const newFile = newNameMap.get(oldName);

                    if (newFile.getModTime() !== oldFile.getModTime()) {
                        modified.push(newFile);
                    }

                } else {
                    deleted.push(oldFile);
                }
            }

            for (const newFile of newFiles) {

                if (!oldNameSet.has(newFile.getFullName())) {
                    added.push(newFile);
                }
            }

            const change = new FileStorageChange();

            for (const file of modified) {
                change.recordModify(file.getFullName());
            }

            for (const file of added) {
                change.recordAdd(file.getFullName());
            }

            for (const file of deleted) {
                change.recordDelete(file.getFullName());
            }

            return change;
        }

        async getProjects(): Promise<string[]> {

            const data = await apiRequest("GetProjects", {});

            if (data.error) {
                alert(`Cannot get the projects list`);
                throw new Error(data.error);
            }

            return data.projects;
        }

        async createFile(folder: FilePath, fileName: string, content: string): Promise<FilePath> {

            const file = new FilePath(folder, {
                children: [],
                isFile: true,
                name: fileName,
                size: 0,
                modTime: 0
            });

            await this.setFileString_priv(file, content);

            folder._add(file);

            const change = new FileStorageChange();

            change.recordAdd(file.getFullName());

            this.fireChange(change);

            return file;
        }

        async createFolder(container: FilePath, folderName: string): Promise<FilePath> {
            const newFolder = new FilePath(container, {
                children: [],
                isFile: false,
                name: folderName,
                size: 0,
                modTime: 0
            });

            const path = container.getFullName() + "/" + folderName;

            const data = await apiRequest("CreateFolder", {
                path: path
            });

            if (data.error) {
                alert(`Cannot create folder at '${path}'`);
                throw new Error(data.error);
            }

            newFolder["_modTime"] = data["modTime"];
            container["_files"].push(newFolder);
            container["_files"].sort((a, b) => a.getName().localeCompare(b.getName()));

            const change = new FileStorageChange();

            change.recordAdd(newFolder.getFullName());

            this.fireChange(change);

            return newFolder;
        }

        async getFileString(file: FilePath): Promise<string> {

            const data = await apiRequest("GetFileString", {
                path: file.getFullName()
            });

            if (data.error) {
                alert(`Cannot get file content of '${file.getFullName()}'`);
                return null;
            }

            const content = data["content"];

            return content;
        }

        async setFileString(file: FilePath, content: string): Promise<void> {

            await this.setFileString_priv(file, content);

            const change = new FileStorageChange();

            change.recordModify(file.getFullName());

            this.fireChange(change);
        }

        private async setFileString_priv(file: FilePath, content: string): Promise<void> {

            const data = await apiRequest("SetFileString", {
                path: file.getFullName(),
                content: content
            });

            if (data.error) {
                alert(`Cannot set file content to '${file.getFullName()}'`);
                throw new Error(data.error);
            }

            const fileData = data as FileData;

            file._setModTime(fileData.modTime);
            file._setSize(fileData.size);
        }

        async deleteFiles(files: FilePath[]) {
            const data = await apiRequest("DeleteFiles", {
                paths: files.map(file => file.getFullName())
            });

            if (data.error) {
                alert(`Cannot delete the files.`);
                throw new Error(data.error);
            }

            const deletedSet = new Set<FilePath>();

            for (const file of files) {

                deletedSet.add(file);

                for (const file2 of file.flatTree([], true)) {
                    deletedSet.add(file2);
                }
            }

            const change = new FileStorageChange();

            for (const file of deletedSet) {

                file._remove();

                change.recordDelete(file.getFullName());
            }

            this.fireChange(change);
        }

        async renameFile(file: FilePath, newName: string) {

            const data = await apiRequest("RenameFile", {
                oldPath: file.getFullName(),
                newPath: file.getParent().getFullName() + "/" + newName
            });

            if (data.error) {
                alert(`Cannot rename the file.`);
                throw new Error(data.error);
            }

            const fromPath = file.getFullName();

            file._setName(newName);

            file.getParent()._sort();

            const change = new FileStorageChange();

            change.recordRename(fromPath, file.getFullName());

            this.fireChange(change);
        }

        async moveFiles(movingFiles: FilePath[], moveTo: FilePath): Promise<void> {

            const data = await apiRequest("MoveFiles", {
                movingPaths: movingFiles.map(file => file.getFullName()),
                movingToPath: moveTo.getFullName()
            });

            const records = movingFiles.map(file => {
                return {
                    from: file.getFullName(),
                    to: moveTo.getFullName() + "/" + file.getName()
                };
            });

            if (data.error) {
                alert(`Cannot move the files.`);
                throw new Error(data.error);
            }

            for (const srcFile of movingFiles) {

                const i = srcFile.getParent().getFiles().indexOf(srcFile);
                srcFile.getParent().getFiles().splice(i, 1);

                moveTo._add(srcFile);
            }

            const change = new FileStorageChange();

            for (const record of records) {
                change.recordRename(record.from, record.to);
            }

            this.fireChange(change);
        }

        async uploadFile(uploadFolder: FilePath, htmlFile: File): Promise<FilePath> {

            const formData = new FormData();

            formData.append("uploadTo", uploadFolder.getFullName());
            formData.append("file", htmlFile);

            const resp = await fetch("upload", {
                method: "POST",
                body: formData
            });

            const data = await resp.json();

            if (data.error) {

                alert(`Error sending file ${htmlFile.name}`);

                throw new Error(data.error);
            }

            const fileData = data.file as FileData;

            let file = uploadFolder.getFile(htmlFile.name);

            const change = new FileStorageChange();

            if (file) {

                file._setModTime(fileData.modTime);
                file._setSize(fileData.size);

                change.recordModify(file.getFullName());

            } else {

                file = new FilePath(null, fileData);

                uploadFolder._add(file);

                change.recordAdd(file.getFullName());
            }

            this.fireChange(change);

            return file;
        }

        async getImageSize(file: FilePath): Promise<ImageSize> {

            const data = await colibri.core.io.apiRequest("GetImageSize", {
                path: file.getFullName()
            });

            if (data.error) {
                return null;
            }

            return {
                width: data.width,
                height: data.height
            };
        }
    }
}