namespace colibri.core.io {

    export interface IFileData {
        name: string;
        isFile: boolean;
        size: number;
        modTime: number;
        children?: IFileData[];
    }
}