/// <reference path="./ContentCache.ts"/>
namespace colibri.core.io {
    
    export class FileContentCache<TContent> extends ContentCache<FilePath, TContent> {

        protected override computeObjectHash(file: FilePath): string {

            return file.getModTime().toString();
        }

        protected computeObjectKey(file: FilePath): string {
            
            return file.getFullName();
        }
    }
}