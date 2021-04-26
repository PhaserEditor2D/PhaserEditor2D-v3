namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class AssetPackEditorPropertyProvider extends controls.properties.PropertySectionProvider {

        constructor(private editor: AssetPackEditor) {
            super("phasereditor2d.pack.ui.editor.properties.AssetPackEditorPropertyProvider");
        }

        addSections(page: controls.properties.PropertyPage,
            sections: Array<controls.properties.PropertySection<any>>): void {

            sections.push(new BlocksSection(page));

            sections.push(new ItemSection(page));

            sections.push(new ImageSection(page));

            sections.push(new SVGSection(page));

            sections.push(new AtlasSection(page));

            sections.push(new AtlasXMLSection(page));

            sections.push(new UnityAtlasSection(page));

            sections.push(new MultiatlasSection(page));

            sections.push(new SpritesheetURLSection(page));

            sections.push(new SpritesheetFrameSection(page));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.AnimationsSection",
                "Animations",
                "URL",
                "url",
                core.contentTypes.CONTENT_TYPE_ANIMATIONS,
                core.ANIMATION_TYPE));

            sections.push(new BitmapFontSection(page));

            sections.push(new TilemapCSVSection(page));

            sections.push(new TilemapImpactSection(page));

            sections.push(new TilemapTiledJSONSection(page));

            sections.push(new PluginSection(page));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.SceneFileSection",
                "Scene File",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                core.SCENE_FILE_TYPE));

            sections.push(new ScenePluginSection(page));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.ScriptSection",
                "Script",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                core.SCRIPT_TYPE));

            sections.push(new ScriptsSection(page));

            sections.push(new AudioSection(page));

            sections.push(new AudioSpriteSection(page));

            sections.push(new VideoSection(page));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.TextSection",
                "Text",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_TEXT,
                core.TEXT_TYPE));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.CSSSection",
                "CSS",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_CSS,
                core.CSS_TYPE));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.GLSLSection",
                "GLSL",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_GLSL,
                core.GLSL_TYPE));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.HTMLSection",
                "HTML",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_HTML,
                core.HTML_TYPE));

            sections.push(new HTMLTextureSection(page));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.BinarySection",
                "Binary",
                "URL",
                "url",
                colibri.core.CONTENT_TYPE_ANY,
                core.BINARY_TYPE));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.JSONSection",
                "JSON",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_JSON,
                core.JSON_TYPE));

            sections.push(new SimpleURLSection(page,
                "phasereditor2d.pack.ui.editor.properties.XMLSection",
                "XML",
                "URL",
                "url",
                webContentTypes.core.CONTENT_TYPE_XML,
                core.XML_TYPE));

            // info sections

            sections.push(new ui.properties.AtlasFrameInfoSection(page));
            sections.push(new pack.ui.properties.TilemapTiledSection(page));

            // preview sections

            sections.push(new ui.properties.ImagePreviewSection(page));

            sections.push(new ui.properties.ManyImagePreviewSection(page));
        }

        getEmptySelectionObject() {

            return this.editor.getPack();
        }

    }
}