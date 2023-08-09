namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_SPINE_BINARY = "phasereditor2d.pack.core.spineBinary";

    export class SpineBinaryContentTypeResolver extends colibri.core.ContentTypeResolverByExtension {

        constructor() {
            super("phasereditor2d.pack.core.contentTypes.spineBinary", [
                ["skel", CONTENT_TYPE_SPINE_BINARY]
            ]);
        }

    }

}