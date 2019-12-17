namespace colibri.core.io {
   
    export declare type FileData = {
        name: string;
        isFile: boolean;
        size: number,
        modTime: number,
        children?: FileData[];
    }

}