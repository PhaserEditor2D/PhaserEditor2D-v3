namespace colibri.core.io {

    interface IGetProjectFilesData {

        hash: string;
        maxNumberOfFiles: number;
        projectNumberOfFiles: number;
        rootFile: IFileData;
        error: string;
    }

    export async function apiRequest(method: string, body?: any) {

        try {

            const resp = await fetch("api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    method,
                    body
                })
            });

            const json = await resp.json();

            // This could happens in servers with session handling.
            // If the session expired, then the server send a redirect message.
            if (json.redirect) {

                document.location.href = json.redirect;
            }

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

    export class HTTPServerFileStorage implements IFileStorage {

        private _root: FilePath;
        private _changeListeners: ChangeListenerFunc[];
        private _hash: string;

        constructor() {

            this._root = null;

            this._hash = "";

            this._changeListeners = [];

            this.registerDocumentVisibilityListener();
        }

        private registerDocumentVisibilityListener() {

            Platform.getWorkbench().eventWindowFocused.addListener(async () => {

                await this.detectServerChangesOnWindowsFocus();
            });
        }

        protected async detectServerChangesOnWindowsFocus() {

            const hashData = await apiRequest("GetProjectFilesHash", {});

            if (hashData.error) {

                alert(hashData.error);

                return;
            }

            const hash = hashData.hash as string;

            if (hash === this._hash) {
                // nothing to do!
                console.log("Server files not changed (hash=" + hash + ")");
                return;
            }

            this._hash = hash;

            const data = await apiRequest("GetProjectFiles", {}) as IGetProjectFilesData;

            if (data.error) {

                alert(data.error);

                return;
            }

            if (data.projectNumberOfFiles > data.maxNumberOfFiles) {

                this.showMaxNumberOfFilesDialog(data.projectNumberOfFiles, data.maxNumberOfFiles);

                return;

            }

            const change = new FileStorageChange(FileStorageChangeCause.WINDOW_FOCUS);

            const localFiles = this._root.flatTree([], true);
            const serverFiles = new FilePath(null, data.rootFile).flatTree([], true);
            const filesToContentTypePreload: FilePath[] = [];

            const localFilesMap = new Map<string, FilePath>();

            for (const file of localFiles) {

                localFilesMap.set(file.getFullName(), file);
            }

            const serverFilesMap = new Map<string, FilePath>();

            for (const file of serverFiles) {

                serverFilesMap.set(file.getFullName(), file);
            }

            // compute modified files

            {
                for (const file of localFiles) {

                    const fileFullName = file.getFullName();

                    const serverFile = serverFilesMap.get(fileFullName);

                    if (serverFile) {

                        if (serverFile.getModTime() !== file.getModTime() || serverFile.getSize() !== file.getSize()) {

                            console.log("Modified - " + fileFullName);

                            file._setModTime(serverFile.getModTime());
                            file._setSize(serverFile.getSize());

                            change.recordModify(fileFullName);

                            filesToContentTypePreload.push(file);
                        }
                    }
                }
            }

            // compute deleted files

            {
                const deletedFilesNamesSet = new Set<string>();

                for (const file of localFiles) {

                    const fileFullName = file.getFullName();

                    if (deletedFilesNamesSet.has(fileFullName)) {
                        // when a parent folder was reported as deleted
                        continue;
                    }

                    if (!serverFilesMap.has(fileFullName)) {

                        console.log("Deleted " + fileFullName);

                        file._remove();

                        change.recordDelete(fileFullName);

                        if (file.isFolder()) {

                            for (const child of file.getFiles()) {

                                deletedFilesNamesSet.add(child.getFullName());
                            }
                        }
                    }
                }
            }

            // compute added files

            {
                const addedFilesNamesSet = new Set<string>();

                for (const file of serverFiles) {

                    const fileFullName = file.getFullName();

                    if (addedFilesNamesSet.has(fileFullName)) {
                        // when a parent folder was reported as added
                        continue;
                    }

                    if (!localFilesMap.has(fileFullName)) {

                        console.log("Added " + fileFullName);

                        const localParentFile = localFilesMap.get(file.getParent().getFullName());

                        localParentFile._add(file);

                        file.visit(f => {

                            localFilesMap.set(f.getFullName(), f);
                            filesToContentTypePreload.push(f);
                        });

                        change.recordAdd(fileFullName);

                        if (file.isFolder()) {

                            for (const child of file.getFiles()) {

                                addedFilesNamesSet.add(child.getFullName());
                            }
                        }
                    }
                }
            }

            const reg = Platform.getWorkbench().getContentTypeRegistry();

            for (const file of filesToContentTypePreload) {

                await reg.preload(file);
            }

            this.fireChange(change);
        }

        private showMaxNumberOfFilesDialog(projectNumberOfFiles: number, maxNumberOfFiles: number) {

            alert(`
                    Your project exceeded the maximum number of files allowed (${projectNumberOfFiles} > ${maxNumberOfFiles}).
                    Please, check the
                    <a href="https://help.phasereditor2d.com/v3/misc/resources-filtering.html" target="_blank">Resources Filtering</a>
                    documentation.
                `);
        }

        addChangeListener(listener: ChangeListenerFunc) {

            this._changeListeners.push(listener);
        }

        addFirstChangeListener(listener: ChangeListenerFunc) {

            this._changeListeners.unshift(listener);
        }

        removeChangeListener(listener: ChangeListenerFunc) {

            const i = this._changeListeners.indexOf(listener);

            this._changeListeners.splice(i, 1);
        }

        getRoot(): FilePath {

            return this._root;
        }

        async openProject(): Promise<FilePath> {

            this._root = null;

            this._hash = "";

            await this.reload();

            const root = this.getRoot();

            const change = new FileStorageChange();

            change.fullProjectLoaded();

            this.fireChange(change);

            return root;
        }

        async reload(): Promise<void> {

            const data = await apiRequest("GetProjectFiles", {}) as IGetProjectFilesData;

            let newRoot: FilePath;

            if (data.projectNumberOfFiles > data.maxNumberOfFiles) {

                newRoot = new FilePath(null, {
                    name: "Unavailable",
                    modTime: 0,
                    size: 0,
                    children: [],
                    isFile: false
                });

                this.showMaxNumberOfFilesDialog(data.projectNumberOfFiles, data.maxNumberOfFiles);

            } else {

                newRoot = new FilePath(null, data.rootFile);
            }

            this._hash = data.hash;

            this._root = newRoot;
        }

        private async fireChange(change: FileStorageChange) {

            for (const listener of this._changeListeners) {

                try {

                    const result = listener(change);

                    if (result instanceof Promise) {

                        await result;
                    }

                } catch (e) {

                    console.error(e);
                }
            }
        }

        async createFile(folder: FilePath, fileName: string, content: string): Promise<FilePath> {

            const file = new FilePath(folder, {
                children: [],
                isFile: true,
                name: fileName,
                size: 0,
                modTime: 0
            });

            await this.server_setFileString(file, content);

            folder._add(file);

            this._hash = "";

            const change = new FileStorageChange();

            change.recordAdd(file.getFullName());

            await this.fireChange(change);

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

            const path = FilePath.join(container.getFullName(), folderName);

            const data = await apiRequest("CreateFolder", {
                path
            });

            if (data.error) {
                alert(`Cannot create folder at '${path}'`);
                throw new Error(data.error);
            }

            newFolder["_modTime"] = data["modTime"];
            container["_files"].push(newFolder);
            container._sort();

            this._hash = "";

            const change = new FileStorageChange();

            change.recordAdd(newFolder.getFullName());

            this.fireChange(change);

            return newFolder;
        }

        async getFileBinary(file: FilePath): Promise<ArrayBuffer> {

            const content = await this.server_getFileBinary(file);

            return content;
        }

        protected async server_getFileBinary(file: FilePath): Promise<ArrayBuffer> {

            const resp = await fetch(file.getUrl(), {
                method: "GET",
                cache: "force-cache"
            });

            const content = await resp.arrayBuffer();

            if (!resp.ok) {

                alert(`Cannot get the content of file '${file.getFullName()}'.`);

                return null;
            }

            return content;
        }

        protected async server_getFileString(file: FilePath): Promise<string> {

            const resp = await fetch(file.getUrl(), {
                method: "GET",
                cache: "force-cache"
            });

            const content = await resp.text();

            if (!resp.ok) {

                alert(`Cannot get the content of file '${file.getFullName()}'.`);

                return null;
            }

            return content;
        }

        async getFileString(file: FilePath): Promise<string> {

            const content = await this.server_getFileString(file);

            return content;
        }

        async setFileString(file: FilePath, content: string): Promise<void> {

            await this.server_setFileString(file, content);

            this._hash = "";

            const change = new FileStorageChange();

            change.recordModify(file.getFullName());

            this.fireChange(change);
        }

        protected async server_setFileString(file: FilePath, content: string): Promise<void> {

            const data = await apiRequest("SetFileString", {
                path: file.getFullName(),
                content
            });

            if (data.error) {
                alert(`Cannot set file content to '${file.getFullName()}'`);
                throw new Error(data.error);
            }

            const fileData = data as IFileData;

            file._setModTime(fileData.modTime);
            file._setSize(fileData.size);
        }

        protected async server_deleteFiles(files: FilePath[]) {

            const data = await apiRequest("DeleteFiles", {
                paths: files.map(file => file.getFullName())
            });

            if (data.error) {

                alert(`Cannot delete the files.`);
                
                throw new Error(data.error);
            }
        }

        async deleteFiles(files: FilePath[]) {

            await this.server_deleteFiles(files);

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

            this._hash = "";

            this.fireChange(change);
        }

        protected async server_renameFile(file: FilePath, newName: string) {

            const data = await apiRequest("RenameFile", {
                oldPath: file.getFullName(),
                newPath: FilePath.join(file.getParent().getFullName(), newName)
            });

            if (data.error) {
                alert(`Cannot rename the file.`);
                throw new Error(data.error);
            }
        }

        async renameFile(file: FilePath, newName: string) {

            await this.server_renameFile(file, newName);

            const fromPath = file.getFullName();

            file._setName(newName);

            file.getParent()._sort();

            this._hash = "";

            const change = new FileStorageChange();

            change.recordRename(fromPath, file.getFullName());

            this.fireChange(change);
        }

        async copyFile(fromFile: FilePath, toFolder: FilePath) {

            const base = fromFile.getNameWithoutExtension();
            let ext = fromFile.getExtension();

            if (ext) {

                ext = "." + ext;
            }

            let suffix = "";

            while (toFolder.getFile(base + suffix + ext)) {
                suffix += "_copy";
            }

            const newName = base + suffix + ext;

            const fileData = await this.server_copyFile(fromFile, toFolder, newName);

            const newFile = new FilePath(null, fileData);

            toFolder._add(newFile);

            this._hash = "";

            const change = new FileStorageChange();

            change.recordAdd(newFile.getFullName());

            this.fireChange(change);

            return newFile;
        }
        
        protected async server_copyFile(fromFile: FilePath, toFolder: FilePath, newName: string) {

            const data = await apiRequest("CopyFile", {
                fromPath: fromFile.getFullName(),
                toPath: FilePath.join(toFolder.getFullName(), newName)
            });

            if (data.error) {
                alert(`Cannot copy the file ${fromFile.getFullName()}`);
                throw new Error(data.error);
            }

            const fileData = data.file as IFileData;

            return fileData;
        }

        async moveFiles(movingFiles: FilePath[], moveTo: FilePath): Promise<void> {

            await this.server_moveFiles(movingFiles, moveTo);

            const records = movingFiles.map(file => {
                return {
                    from: file.getFullName(),
                    to: FilePath.join(moveTo.getFullName(), file.getName())
                };
            });

            for (const srcFile of movingFiles) {

                const i = srcFile.getParent().getFiles().indexOf(srcFile);
                srcFile.getParent().getFiles().splice(i, 1);

                moveTo._add(srcFile);
            }

            this._hash = "";

            const change = new FileStorageChange();

            for (const record of records) {
                change.recordRename(record.from, record.to);
            }

            this.fireChange(change);
        }

        protected async server_moveFiles(movingFiles: FilePath[], moveTo: FilePath) {
            
            const data = await apiRequest("MoveFiles", {
                movingPaths: movingFiles.map(file => file.getFullName()),
                movingToPath: moveTo.getFullName()
            });

            if (data.error) {
                alert(`Cannot move the files.`);
                throw new Error(data.error);
            }
        }

        protected async server_uploadFile(uploadFolder: FilePath, htmlFile: File): Promise<IFileData> {

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

            return data.file as IFileData;
        }

        async uploadFile(uploadFolder: FilePath, htmlFile: File): Promise<FilePath> {

            const fileData = await this.server_uploadFile(uploadFolder, htmlFile);

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

            this._hash = "";

            this.fireChange(change);

            return file;
        }

        async getImageSize(file: FilePath): Promise<ImageSize> {

            const key = "GetImageSize_" + file.getFullName() + "@" + file.getModTime();

            const cache = localStorage.getItem(key);

            if (cache) {

                return JSON.parse(cache);
            }

            const data = await colibri.core.io.apiRequest("GetImageSize", {
                path: file.getFullName()
            });

            if (data.error) {
                return null;
            }

            const size = {
                width: data.width,
                height: data.height
            };

            window.localStorage.setItem(key, JSON.stringify(size));

            return size;
        }
    }
}