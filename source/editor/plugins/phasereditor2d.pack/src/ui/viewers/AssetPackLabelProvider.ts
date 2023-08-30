namespace phasereditor2d.pack.ui.viewers {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class AssetPackLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: any): string {

            const exts = AssetPackPlugin.getInstance().getViewerExtensions();
            
            for(const ext of exts) {

                if (ext.acceptObject(obj)) {

                    return ext.getLabel(obj);
                }
            }

            if (obj instanceof io.FilePath) {

                if (obj.isFolder()) {

                    if (obj.isRoot()) {

                        return "/";
                    }

                    return obj.getProjectRelativeName().substring(1);
                }
            }

            if (obj instanceof core.AssetPack) {

                return obj.getFile().getProjectRelativeName().substring(1);
            }

            if (obj instanceof core.AssetPackItem) {

                return obj.getKey();
            }

            if (obj instanceof controls.ImageFrame) {

                if (obj instanceof core.AssetPackImageFrame) {

                    let name = obj.getName().toString();

                    const item = obj.getPackItem();

                    if (item instanceof core.SpritesheetAssetPackItem) {

                        const len = item.getFrames().length;

                        if (len > 0) {

                            const spaces = Math.ceil(Math.log10(len));

                            while (name.length < spaces) {

                                name = "0" + name;
                            }
                        }
                    }

                    return name;
                }

                return obj.getName() + "";
            }

            if (obj instanceof pack.core.AnimationConfigInPackItem) {

                return obj.getKey();
            }

            if (obj instanceof pack.core.AnimationFrameConfigInPackItem) {

                return obj.getFrameKey() !== undefined ?
                    obj.getFrameKey() + " / " + obj.getTextureKey()
                    : obj.getTextureKey();
            }

            if (typeof (obj) === "string") {

                const name = AssetPackPlugin.getInstance().getAssetPackItemTypeDisplayName(obj);

                return name || obj;
            }

            return "";
        }

    }

}