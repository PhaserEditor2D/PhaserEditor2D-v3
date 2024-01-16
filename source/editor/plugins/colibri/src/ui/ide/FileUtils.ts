namespace colibri.ui.ide {

    import io = core.io;

    export class FileUtils {

        static visit(folder: io.FilePath, visitor: (file: io.FilePath) => void) {

            visitor(folder);

            for (const file of folder.getFiles()) {

                this.visit(file, visitor);
            }
        }

        static visitProject(visitor: (file: io.FilePath) => void) {

            this.visit(this.getRoot(), visitor);
        }

        static getFileNameWithoutExtension(filename: string) {

            const i = filename.lastIndexOf(".");

            return filename.substring(0, i);
        }

        static getFileCopyName(file: io.FilePath) {

            const parent = file.getParent();

            let name = file.getNameWithoutExtension();

            while (parent.getFile(name + ".scene")) {

                name = name + "_copy";
            }

            return name + ".scene";
        }

        static preloadImageSize(file: io.FilePath): Promise<controls.PreloadResult> {
            return Workbench.getWorkbench().getFileImageSizeCache().preload(file);
        }

        static getImageSize(file: io.FilePath): core.io.ImageSize {
            return Workbench.getWorkbench().getFileImageSizeCache().getContent(file);
        }

        static getImage(file: io.FilePath) {
            return Workbench.getWorkbench().getFileImage(file);
        }

        static async preloadAndGetFileString(file: io.FilePath): Promise<string> {

            await this.preloadFileString(file);

            return this.getFileString(file);
        }

        static getFileBinary(file: io.FilePath): ArrayBuffer {

            return Workbench.getWorkbench().getFileBinaryCache().getContent(file);
        }

        static getFileString(file: io.FilePath): string {

            return Workbench.getWorkbench().getFileStringCache().getContent(file);
        }

        static setFileString_async(file: io.FilePath, content: string): Promise<void> {

            return Workbench.getWorkbench().getFileStringCache().setContent(file, content);
        }

        static getFileStringCache() {

            return Workbench.getWorkbench().getFileStringCache();
        }

        static getFileStorage() {

            return Workbench.getWorkbench().getFileStorage();
        }

        static async createFile_async(folder: io.FilePath, fileName: string, content: string): Promise<io.FilePath> {

            let file = folder.getFile(fileName);

            if (file) {

                await this.setFileString_async(file, content);

                await Platform.getWorkbench().getContentTypeRegistry().preload(file);

                return file;
            }

            const storage = this.getFileStorage();

            file = await storage.createFile(folder, fileName, content);

            await Platform.getWorkbench().getContentTypeRegistry().preload(file);

            return file;
        }

        static async createFolder_async(container: io.FilePath, folderName: string): Promise<io.FilePath> {

            const storage = Workbench.getWorkbench().getFileStorage();

            const folder = await storage.createFolder(container, folderName);

            return folder;
        }

        static async deleteFiles_async(files: io.FilePath[]): Promise<void> {

            const storage = Workbench.getWorkbench().getFileStorage();

            await storage.deleteFiles(files);
        }

        static async renameFile_async(file: io.FilePath, newName: string): Promise<void> {

            const storage = Workbench.getWorkbench().getFileStorage();

            await storage.renameFile(file, newName);
        }

        static async moveFiles_async(movingFiles: io.FilePath[], moveTo: io.FilePath) {

            const storage = Workbench.getWorkbench().getFileStorage();

            await storage.moveFiles(movingFiles, moveTo);
        }

        static async copyFile_async(fromFile: io.FilePath, toFile: io.FilePath) {

            const storage = Workbench.getWorkbench().getFileStorage();

            return await storage.copyFile(fromFile, toFile);
        }

        static async preloadFileString(file: io.FilePath): Promise<ui.controls.PreloadResult> {

            const cache = Workbench.getWorkbench().getFileStringCache();

            return cache.preload(file);
        }

        static async preloadFileBinary(file: io.FilePath): Promise<ui.controls.PreloadResult> {

            const cache = Workbench.getWorkbench().getFileBinaryCache();

            return cache.preload(file);
        }

        static getPublicRoot(folder: io.FilePath): io.FilePath {

            if (folder.getFile("publicroot") || folder.isRoot()) {

                return folder;
            }

            return this.getPublicRoot(folder.getParent());
        }

        static getFileFromPath(path: string, parent?: io.FilePath): io.FilePath {

            let result = parent;

            const names = path.split("/");

            if (!result) {

                result = Workbench.getWorkbench().getProjectRoot();

                const name = names.shift();

                if (name !== result.getName()) {

                    return null;
                }
            }

            for (const name of names) {

                const child = result.getFile(name);

                if (child) {

                    result = child;

                } else {

                    return null;
                }
            }

            return result;
        }

        static async uploadFile_async(uploadFolder: io.FilePath, file: File) {

            const storage = Workbench.getWorkbench().getFileStorage();

            return storage.uploadFile(uploadFolder, file);
        }

        static async getFilesWithContentType(contentType: string) {

            const reg = Workbench.getWorkbench().getContentTypeRegistry();

            const files = this.getAllFiles();

            for (const file of files) {

                await reg.preload(file);
            }

            return files.filter(file => reg.getCachedContentType(file) === contentType);
        }

        static getAllFiles() {

            const files: io.FilePath[] = [];

            Workbench.getWorkbench().getProjectRoot().flatTree(files, false);

            return files;
        }

        static getRoot() {
            return Workbench.getWorkbench().getProjectRoot();
        }

        static distinct(folders: io.FilePath[]) {

            return this.sorted([...new Set(folders)]);
        }

        static compareFiles(a: io.FilePath, b: io.FilePath) {

            const aa = a.getFullName().split("/").length;
            const bb = b.getFullName().split("/").length;

            if (aa === bb) {

                return a.getName().localeCompare(b.getName());
            }

            return aa - bb;
        }

        static sorted(folders: io.FilePath[]) {

            return folders.sort((a, b) => this.compareFiles(a, b));
        }

    }
}