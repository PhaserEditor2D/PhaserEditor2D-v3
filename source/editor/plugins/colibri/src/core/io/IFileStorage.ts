namespace colibri.core.io {

    export declare type ChangeListenerFunc = (change: FileStorageChange) => any;

    export declare type ProjectTemplatesData = {
        providers: Array<{
            name: string,
            templates: {
                name: string,
                path: string
            }
        }>
    };

    export declare type ImageSize = {
        width: number,
        height: number
    };

    export interface IProjectsData {
        projects: string[];
        workspacePath?: string;
    }

    export interface IFileStorage {

        reload(): Promise<void>;

        openProject(): Promise<FilePath>;

        getRoot(): FilePath;

        getFileString(file: FilePath): Promise<string>;

        setFileString(file: FilePath, content: string): Promise<void>;

        getFileBinary(file: FilePath): Promise<ArrayBuffer>;

        createFile(container: FilePath, fileName: string, content: string): Promise<FilePath>;

        createFolder(container: FilePath, folderName: string): Promise<FilePath>;

        deleteFiles(files: FilePath[]): Promise<void>;

        renameFile(file: FilePath, newName: string): Promise<void>;

        moveFiles(movingFiles: FilePath[], moveTo: FilePath): Promise<void>;

        copyFile(fromFile: FilePath, toFile: FilePath): Promise<FilePath>;

        uploadFile(uploadFolder: FilePath, file: File): Promise<FilePath>;

        getImageSize(file: FilePath): Promise<ImageSize>;

        addChangeListener(listener: ChangeListenerFunc): void;

        addFirstChangeListener(listener: ChangeListenerFunc): void;

        removeChangeListener(listener: ChangeListenerFunc): void;
    }
}