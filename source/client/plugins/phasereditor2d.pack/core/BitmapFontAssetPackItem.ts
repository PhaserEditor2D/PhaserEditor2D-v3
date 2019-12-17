namespace phasereditor2d.pack.core {

    import io = colibri.core.io;

    export class BitmapFontAssetPackItem extends AssetPackItem {

        constructor(pack : AssetPack, data : any) {
            super(pack, data)
        }

        computeUsedFiles(files : Set<io.FilePath>) {
            
            super.computeUsedFiles(files);

            this.addFilesFromDataKey(files, "fontDataURL", "textureURL");
        }
    }
}