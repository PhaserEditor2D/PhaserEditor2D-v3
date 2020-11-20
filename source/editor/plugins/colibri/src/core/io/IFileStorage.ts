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

        changeWorkspace(serverPath: string): Promise<void>

        getProjects(workspacePath?: string): Promise<IProjectsData>;

        openProject(projectName: string): Promise<FilePath>;

        isValidAccount(): Promise<string>;

        getProjectTemplates(): Promise<ProjectTemplatesData>;

        createProject(templatePath: string, projectName: string): Promise<boolean>;

        getRoot(): FilePath;

        getFileString(file: FilePath): Promise<string>;

        setFileString(file: FilePath, content: string): Promise<void>;

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