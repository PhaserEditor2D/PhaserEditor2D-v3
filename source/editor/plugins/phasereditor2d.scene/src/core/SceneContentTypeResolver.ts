namespace phasereditor2d.scene.core {

    import core = colibri.core;

    export const CONTENT_TYPE_SCENE = "phasereditor2d.core.scene.SceneContentType";
    export const CONTENT_TYPE_USER_COMPONENTS = "phasereditor2d.core.scene.UserComponents";

    export class SceneContentTypeResolver extends core.ContentTypeResolver {

        constructor() {
            super("phasereditor2d.scene.core.SceneContentTypeResolver");
        }

        async computeContentType(file: core.io.FilePath): Promise<string> {

            if (file.getExtension() === "scene") {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                if (content !== null) {

                    try {

                        const data = JSON.parse(content);

                        if (data.meta.contentType === CONTENT_TYPE_SCENE) {

                            return CONTENT_TYPE_SCENE;
                        }

                    } catch (e) {
                        // nothing
                    }
                }
            }

            return core.CONTENT_TYPE_ANY;
        }

    }
}