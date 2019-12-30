namespace colibri.core.io {

    export interface FileData {
        name: string;
        isFile: boolean;
        size: number;
        modTime: number;
        children?: FileData[];
    }
}