declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_ANIMATIONS = "Phaser v3 Animations";
    class AnimationsContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack {
    const ICON_ASSET_PACK = "asset-pack";
    const ICON_ANIMATIONS = "animations";
    class AssetPackPlugin extends colibri.Plugin {
        private static _instance;
        static getInstance(): AssetPackPlugin;
        private constructor();
        registerExtensions(reg: colibri.ExtensionRegistry): void;
    }
}
declare namespace phasereditor2d.pack.core {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    abstract class AssetPackItem {
        private _pack;
        private _data;
        private _editorData;
        constructor(pack: AssetPack, data: any);
        computeUsedFiles(files: Set<io.FilePath>): void;
        protected addFilesFromDataKey(files: Set<io.FilePath>, ...keys: string[]): void;
        protected addFilesFromUrls(files: Set<io.FilePath>, urls: string[]): void;
        getEditorData(): any;
        getPack(): AssetPack;
        getKey(): string;
        setKey(key: string): void;
        getType(): string;
        getData(): any;
        addToPhaserCache(game: Phaser.Game): void;
        preload(): Promise<controls.PreloadResult>;
        resetCache(): void;
    }
}
declare namespace phasereditor2d.pack.core {
    class AnimationsAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    import core = colibri.core;
    import io = colibri.core.io;
    const IMAGE_TYPE = "image";
    const ATLAS_TYPE = "atlas";
    const ATLAS_XML_TYPE = "atlasXML";
    const UNITY_ATLAS_TYPE = "unityAtlas";
    const MULTI_ATLAS_TYPE = "multiatlas";
    const SPRITESHEET_TYPE = "spritesheet";
    const ANIMATION_TYPE = "animation";
    const AUDIO_TYPE = "audio";
    const AUDIO_SPRITE_TYPE = "audioSprite";
    const BINARY_TYPE = "binary";
    const BITMAP_FONT_TYPE = "bitmapFont";
    const CSS_TYPE = "css";
    const GLSL_TYPE = "glsl";
    const HTML_TYPE = "html";
    const HTML_TEXTURE_TYPE = "htmlTexture";
    const JSON_TYPE = "json";
    const PLUGIN_TYPE = "plugin";
    const SCENE_FILE_TYPE = "sceneFile";
    const SCENE_PLUGIN_TYPE = "scenePlugin";
    const SCRIPT_TYPE = "script";
    const SVG_TYPE = "svg";
    const TEXT_TYPE = "text";
    const TILEMAP_CSV_TYPE = "tilemapCSV";
    const TILEMAP_IMPACT_TYPE = "tilemapImpact";
    const TILEMAP_TILED_JSON_TYPE = "tilemapTiledJSON";
    const VIDEO_TYPE = "video";
    const XML_TYPE = "xml";
    const TYPES: string[];
    class AssetPack {
        private _file;
        private _items;
        constructor(file: core.io.FilePath, content: string);
        computeUsedFiles(files?: Set<io.FilePath>): Set<io.FilePath>;
        toJSON(): any;
        fromJSON(data: any): void;
        createPackItem(data: any): AnimationsAssetPackItem | ImageAssetPackItem | SvgAssetPackItem | AtlasAssetPackItem | AtlasXMLAssetPackItem | UnityAtlasAssetPackItem | MultiatlasAssetPackItem | SpritesheetAssetPackItem | BitmapFontAssetPackItem | TilemapCSVAssetPackItem | TilemapImpactAssetPackItem | TilemapTiledJSONAssetPackItem | PluginAssetPackItem | SceneFileAssetPackItem | ScenePluginAssetPackItem | ScriptAssetPackItem | AudioAssetPackItem | AudioSpriteAssetPackItem | VideoAssetPackItem | TextAssetPackItem | CssAssetPackItem | GlslAssetPackItem | HTMLAssetPackItem | HTMLTextureAssetPackItem | BinaryAssetPackItem | JSONAssetPackItem | XMLAssetPackItem;
        static createFromFile(file: core.io.FilePath): Promise<AssetPack>;
        getItems(): AssetPackItem[];
        deleteItem(item: AssetPackItem): void;
        getFile(): io.FilePath;
    }
}
declare namespace phasereditor2d.pack.core {
    import controls = colibri.ui.controls;
    class AssetPackImageFrame extends controls.ImageFrame {
        private _packItem;
        constructor(packItem: ImageFrameContainerAssetPackItem, name: string, frameImage: controls.IImage, frameData: controls.FrameData);
        getPackItem(): ImageFrameContainerAssetPackItem;
    }
}
declare namespace phasereditor2d.pack.core {
    import io = colibri.core.io;
    class AssetPackUtils {
        static isAtlasType(type: string): boolean;
        static getAllPacks(): Promise<AssetPack[]>;
        static getFileFromPackUrl(url: string): io.FilePath;
        static getFilePackUrl(file: io.FilePath): any;
        static getFilePackUrlWithNewExtension(file: io.FilePath, ext: string): string;
        static getFileStringFromPackUrl(url: string): string;
        static getFileJSONFromPackUrl(url: string): any;
        static getFileXMLFromPackUrl(url: string): Document;
        static getImageFromPackUrl(url: string): colibri.ui.ide.FileImage;
    }
}
declare namespace phasereditor2d.pack.core {
    import controls = colibri.ui.controls;
    abstract class ImageFrameContainerAssetPackItem extends AssetPackItem {
        private _frames;
        constructor(pack: AssetPack, data: any);
        preload(): Promise<controls.PreloadResult>;
        preloadImages(): Promise<void>;
        resetCache(): void;
        protected abstract createParser(): parsers.ImageFrameParser;
        findFrame(frameName: any): AssetPackImageFrame;
        getFrames(): AssetPackImageFrame[];
        addToPhaserCache(game: Phaser.Game): void;
    }
}
declare namespace phasereditor2d.pack.core {
    import io = colibri.core.io;
    abstract class BaseAtlasAssetPackItem extends ImageFrameContainerAssetPackItem {
        computeUsedFiles(files: Set<io.FilePath>): void;
    }
}
declare namespace phasereditor2d.pack.core {
    class AtlasAssetPackItem extends BaseAtlasAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
    }
}
declare namespace phasereditor2d.pack.core {
    class AtlasXMLAssetPackItem extends BaseAtlasAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
    }
}
declare namespace phasereditor2d.pack.core {
    class AudioAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    import io = colibri.core.io;
    class AudioSpriteAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
        computeUsedFiles(files: Set<io.FilePath>): void;
    }
}
declare namespace phasereditor2d.pack.core {
    class BinaryAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    import io = colibri.core.io;
    class BitmapFontAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
        computeUsedFiles(files: Set<io.FilePath>): void;
    }
}
declare namespace phasereditor2d.pack.core {
    class CssAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    type FrameDataType = {
        "filename": string;
        "trimmed": boolean;
        "rotated": boolean;
        "frame": {
            "x": number;
            "y": number;
            "w": number;
            "h": number;
        };
        "spriteSourceSize": {
            "x": number;
            "y": number;
            "w": number;
            "h": number;
        };
        "sourceSize": {
            "w": number;
            "h": number;
        };
    };
}
declare namespace phasereditor2d.pack.core {
    class GlslAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class HTMLAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class HTMLTextureAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class ImageAssetPackItem extends ImageFrameContainerAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
    }
}
declare namespace phasereditor2d.pack.core {
    class JSONAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    import io = colibri.core.io;
    class MultiatlasAssetPackItem extends BaseAtlasAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
        computeUsedFiles(files: Set<io.FilePath>): void;
    }
}
declare namespace phasereditor2d.pack.core {
    import controls = colibri.ui.controls;
    class PackFinder {
        private _packs;
        constructor(...packs: AssetPack[]);
        preload(monitor?: controls.IProgressMonitor): Promise<controls.PreloadResult>;
        getPacks(): AssetPack[];
        findAssetPackItem(key: string): AssetPackItem;
        findPackItemOrFrameWithKey(key: string): AssetPackItem | AssetPackImageFrame;
        getAssetPackItemOrFrame(key: string, frame: any): AssetPackItem | AssetPackImageFrame;
        getAssetPackItemImage(key: string, frame: any): controls.IImage;
    }
}
declare namespace phasereditor2d.pack.core {
    class PluginAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class SceneFileAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class ScenePluginAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class ScriptAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class SpritesheetAssetPackItem extends ImageFrameContainerAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
    }
}
declare namespace phasereditor2d.pack.core {
    class SvgAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class TextAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class TilemapCSVAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class TilemapImpactAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class TilemapTiledJSONAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class UnityAtlasAssetPackItem extends BaseAtlasAssetPackItem {
        constructor(pack: AssetPack, data: any);
        protected createParser(): parsers.ImageFrameParser;
    }
}
declare namespace phasereditor2d.pack.core {
    class VideoAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core {
    class XMLAssetPackItem extends AssetPackItem {
        constructor(pack: AssetPack, data: any);
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import core = colibri.core;
    const CONTENT_TYPE_ASSET_PACK = "phasereditor2d.pack.core.AssetContentType";
    class AssetPackContentTypeResolver extends core.ContentTypeResolver {
        constructor();
        computeContentType(file: core.io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_ATLAS = "phasereditor2d.pack.core.atlas";
    class AtlasContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_ATLAS_XML = "phasereditor2d.pack.core.atlasXML";
    class AtlasXMLContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_AUDIO_SPRITE = "phasereditor2d.pack.core.audioSprite";
    class AudioSpriteContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_BITMAP_FONT = "phasereditor2d.pack.core.bitmapFont";
    class BitmapFontContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_MULTI_ATLAS = "phasereditor2d.pack.core.multiAtlas";
    class MultiatlasContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    const CONTENT_TYPE_TILEMAP_IMPACT = "phasereditor2d.pack.core.contentTypes.tilemapImpact";
    class TilemapImpactContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: colibri.core.io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    const CONTENT_TYPE_TILEMAP_TILED_JSON = "phasereditor2d.pack.core.contentTypes.tilemapTiledJSON";
    class TilemapTiledJSONContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: colibri.core.io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.contentTypes {
    import io = colibri.core.io;
    const CONTENT_TYPE_UNITY_ATLAS = "phasereditor2d.pack.core.unityAtlas";
    class UnityAtlasContentTypeResolver implements colibri.core.IContentTypeResolver {
        getId(): string;
        computeContentType(file: io.FilePath): Promise<string>;
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    abstract class ImageFrameParser {
        private _packItem;
        constructor(packItem: AssetPackItem);
        getPackItem(): AssetPackItem;
        static initSourceImageMap(game: Phaser.Game): void;
        static clearSourceImageMap(game: Phaser.Game): void;
        static setSourceImageFrame(game: Phaser.Game, image: controls.IImage, key: string, frame?: string | number): void;
        static getSourceImageFrame(game: Phaser.Game, key: string, frame?: string | number): any;
        abstract addToPhaserCache(game: Phaser.Game): void;
        abstract preloadFrames(): Promise<controls.PreloadResult>;
        abstract parseFrames(): AssetPackImageFrame[];
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    abstract class BaseAtlasParser extends ImageFrameParser {
        private _preloadImageSize;
        constructor(packItem: AssetPackItem, preloadImageSize: boolean);
        addToPhaserCache(game: Phaser.Game): void;
        preloadFrames(): Promise<controls.PreloadResult>;
        protected abstract parseFrames2(frames: AssetPackImageFrame[], image: controls.IImage, atlas: string): any;
        parseFrames(): AssetPackImageFrame[];
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class AtlasParser extends BaseAtlasParser {
        constructor(packItem: AssetPackItem);
        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.IImage, atlas: string): void;
        static buildFrameData(packItem: AssetPackItem, image: controls.IImage, frame: FrameDataType, index: number): AssetPackImageFrame;
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class AtlasXMLParser extends BaseAtlasParser {
        constructor(packItem: AssetPackItem);
        addToPhaserCache(game: Phaser.Game): void;
        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.IImage, atlas: string): void;
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class ImageParser extends ImageFrameParser {
        constructor(packItem: AssetPackItem);
        addToPhaserCache(game: Phaser.Game): void;
        preloadFrames(): Promise<controls.PreloadResult>;
        parseFrames(): AssetPackImageFrame[];
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class MultiAtlasParser extends ImageFrameParser {
        constructor(packItem: AssetPackItem);
        addToPhaserCache(game: Phaser.Game): void;
        preloadFrames(): Promise<controls.PreloadResult>;
        parseFrames(): AssetPackImageFrame[];
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class SpriteSheetParser extends ImageFrameParser {
        constructor(packItem: AssetPackItem);
        addToPhaserCache(game: Phaser.Game): void;
        preloadFrames(): Promise<controls.PreloadResult>;
        parseFrames(): AssetPackImageFrame[];
    }
}
declare namespace phasereditor2d.pack.core.parsers {
    import controls = colibri.ui.controls;
    class UnityAtlasParser extends BaseAtlasParser {
        constructor(packItem: AssetPackItem);
        addToPhaserCache(game: Phaser.Game): void;
        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.IImage, atlas: string): void;
        private addFrame;
    }
}
declare namespace phasereditor2d.pack.ui.dialogs {
    import io = colibri.core.io;
    class NewAssetPackFileWizardExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
        constructor();
        getInitialFileLocation(): io.FilePath;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import ide = colibri.ui.ide;
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class AssetPackEditorFactory extends ide.EditorFactory {
        constructor();
        acceptInput(input: any): boolean;
        createEditor(): ide.EditorPart;
    }
    class AssetPackEditor extends ide.ViewerFileEditor {
        private _pack;
        private _outlineProvider;
        private _blocksProvider;
        private _propertyProvider;
        constructor();
        static getFactory(): AssetPackEditorFactory;
        static registerCommands(manager: ide.commands.CommandManager): void;
        private static isEditorScope;
        deleteSelection(): void;
        updateAll(): void;
        repaintEditorAndOutline(): void;
        protected createViewer(): controls.viewers.TreeViewer;
        private updateContent;
        doSave(): Promise<void>;
        protected onEditorInputContentChanged(): void;
        onPartActivated(): Promise<void>;
        private resetPackCache;
        getPack(): core.AssetPack;
        getEditorViewerProvider(key: string): ide.EditorViewerProvider;
        getPropertyProvider(): properties.AssetPackEditorPropertyProvider;
        createEditorToolbar(parent: HTMLElement): controls.ToolbarManager;
        private openAddFileDialog;
        createFilesViewer(filter: (file: io.FilePath) => boolean): Promise<controls.viewers.TreeViewer>;
        private openSelectFileDialog_async;
        importData_async(importData: ImportData): Promise<void>;
        private updateBlocks;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    class AssetPackEditorBlocksContentProvider extends files.ui.viewers.FileTreeContentProvider {
        private _editor;
        private _ignoreFileSet;
        constructor(editor: AssetPackEditor);
        getIgnoreFileSet(): IgnoreFileSet;
        updateIgnoreFileSet_async(): Promise<void>;
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
        private acceptFile;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import controls = colibri.ui.controls;
    class AssetPackEditorBlocksPropertySectionProvider extends files.ui.views.FilePropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import ide = colibri.ui.ide;
    class AssetPackEditorBlocksProvider extends ide.EditorViewerProvider {
        private _editor;
        private _contentProvider;
        constructor(editor: AssetPackEditor);
        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider;
        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider;
        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider;
        getUndoManager(): ide.undo.UndoManager;
        getInput(): colibri.core.io.FilePath[];
        updateBlocks_async(): Promise<void>;
        preload(): Promise<void>;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    abstract class AssetPackContentProvider implements controls.viewers.ITreeContentProvider {
        abstract getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    class AssetPackEditorContentProvider extends viewers.AssetPackContentProvider {
        private _editor;
        private _groupAtlasItems;
        constructor(editor: AssetPackEditor, groupAtlasItems: boolean);
        getPack(): core.AssetPack;
        getRoots(input: any): any[];
        getChildren(parent: any): any[];
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    class AssetPackEditorOutlineContentProvider extends AssetPackEditorContentProvider {
        constructor(editor: AssetPackEditor);
        getRoots(): string[];
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import ide = colibri.ui.ide;
    class AssetPackEditorOutlineProvider extends ide.EditorViewerProvider {
        private _editor;
        constructor(editor: AssetPackEditor);
        getUndoManager(): ide.undo.UndoManager;
        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider;
        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider;
        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider;
        getTreeViewerRenderer(viewer: colibri.ui.controls.viewers.TreeViewer): colibri.ui.controls.viewers.TreeViewerRenderer;
        getPropertySectionProvider(): colibri.ui.controls.properties.PropertySectionProvider;
        getInput(): any;
        preload(): Promise<void>;
        onViewerSelectionChanged(selection: any[]): void;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    class AssetPackTreeViewerRenderer extends controls.viewers.GridTreeViewerRenderer {
        constructor(viewer: controls.viewers.TreeViewer, flat: boolean);
        renderCellBack(args: controls.viewers.RenderCellArgs, selected: boolean, isLastChild: boolean): void;
        protected isParent(obj: any): boolean;
        protected isChild(obj: any): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class AssetPackEditorTreeViewerRenderer extends viewers.AssetPackTreeViewerRenderer {
        private _editor;
        constructor(editor: AssetPackEditor, viewer: controls.viewers.TreeViewer);
        isChild(file: io.FilePath): boolean;
        isParent(file: io.FilePath): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    import io = colibri.core.io;
    class IgnoreFileSet extends Set<io.FilePath> {
        private _editor;
        constructor(editor: AssetPackEditor);
        updateIgnoreFileSet_async(): Promise<void>;
    }
}
declare namespace phasereditor2d.pack.ui.editor {
    type ImportData = {
        importer: importers.Importer;
        files: colibri.core.io.FilePath[];
    };
}
declare namespace phasereditor2d.pack.ui.editor {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    class ImportFileSection extends controls.properties.PropertySection<io.FilePath> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class AssetPackEditorPropertyProvider extends controls.properties.PropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    import io = colibri.core.io;
    abstract class BaseSection extends controls.properties.PropertySection<core.AssetPackItem> {
        getEditor(): AssetPackEditor;
        changeItemField(key: string, value: any, updateSelection?: boolean): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
        browseFile_onlyContentType(title: string, contentType: string, selectionCallback: (files: io.FilePath[]) => void): Promise<void>;
        browseFile(title: string, fileFilter: (file: io.FilePath) => boolean, selectionCallback: (files: io.FilePath[]) => void): Promise<void>;
        protected createFileField(comp: HTMLElement, label: string, fieldKey: string, contentType: string): void;
        protected createMultiFileField(comp: HTMLElement, label: string, fieldKey: string, contentType: string): void;
        protected createSimpleTextField(parent: HTMLElement, label: string, field: string): HTMLInputElement;
        protected createSimpleIntegerField(parent: HTMLElement, label: string, field: string): HTMLInputElement;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class AtlasSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class AtlasXMLSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class AudioSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class AudioSpriteSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class BitmapFontSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class HTMLTextureSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class ImageSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class ItemSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class MultiatlasSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class PluginSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SVGSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class ScenePluginSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SimpleURLSection extends BaseSection {
        private _label;
        private _dataKey;
        private _contentType;
        private _assetPackType;
        constructor(page: controls.properties.PropertyPage, id: string, title: string, fieldLabel: string, dataKey: string, contentType: string, assetPackType: string);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SpritesheetFrameSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class SpritesheetURLSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class TilemapCSVSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class TilemapImpactSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class TilemapTiledJSONSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class UnityAtlasSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.properties {
    import controls = colibri.ui.controls;
    class VideoSection extends BaseSection {
        constructor(page: controls.properties.PropertyPage);
        canEdit(obj: any, n: number): boolean;
        protected createForm(parent: HTMLDivElement): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.undo {
    import ide = colibri.ui.ide;
    class AssetPackEditorOperation extends ide.undo.Operation {
        private _editor;
        private _before;
        private _after;
        static takeSnapshot(editor: AssetPackEditor): any;
        constructor(editor: AssetPackEditor, before: any, after: any);
        private load;
        undo(): void;
        redo(): void;
    }
}
declare namespace phasereditor2d.pack.ui.editor.undo {
    import ide = colibri.ui.ide;
    class ChangeItemFieldOperation extends ide.undo.Operation {
        private _editor;
        private _itemIndexList;
        private _fieldKey;
        private _newValueList;
        private _oldValueList;
        private _updateSelection;
        constructor(editor: AssetPackEditor, items: core.AssetPackItem[], fieldKey: string, newValue: any, updateSelection?: boolean);
        undo(): void;
        redo(): void;
        private load_async;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    abstract class Importer {
        private _type;
        constructor(type: string);
        getType(): string;
        abstract acceptFile(file: io.FilePath): boolean;
        abstract createItemData(file: io.FilePath): any;
        importFile(pack: core.AssetPack, file: io.FilePath): Promise<core.AssetPackItem>;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    abstract class ContentTypeImporter extends Importer {
        private _contentType;
        constructor(contentType: string, assetPackItemType: string);
        getContentType(): string;
        acceptFile(file: io.FilePath): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    class BaseAtlasImporter extends ContentTypeImporter {
        acceptFile(file: io.FilePath): boolean;
        createItemData(file: io.FilePath): {
            atlasURL: any;
            textureURL: string;
        };
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class AtlasImporter extends BaseAtlasImporter {
        constructor();
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class AtlasXMLImporter extends BaseAtlasImporter {
        constructor();
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class AudioSpriteImporter extends ContentTypeImporter {
        constructor();
        createItemData(file: colibri.core.io.FilePath): {
            jsonURL: any;
            audioURL: any[];
        };
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class BitmapFontImporter extends ContentTypeImporter {
        constructor();
        createItemData(file: colibri.core.io.FilePath): {
            textureURL: string;
            fontDataURL: any;
        };
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    class MultiatlasImporter extends ContentTypeImporter {
        constructor();
        createItemData(file: io.FilePath): {
            type: string;
            url: any;
            path: any;
        };
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class UnityAtlasImporter extends BaseAtlasImporter {
        constructor();
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    class SingleFileImporter extends ContentTypeImporter {
        private _urlIsArray;
        private _defaultValues;
        constructor(contentType: string, assetPackType: string, urlIsArray?: boolean, defaultValues?: any);
        acceptFile(file: io.FilePath): boolean;
        createItemData(file: io.FilePath): any;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    class SpritesheetImporter extends SingleFileImporter {
        constructor();
        createItemData(file: io.FilePath): any;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    import io = colibri.core.io;
    class ScenePluginImporter extends SingleFileImporter {
        constructor();
        createItemData(file: io.FilePath): any;
    }
}
declare namespace phasereditor2d.pack.ui.importers {
    class Importers {
        private static _list;
        static getAll(): Importer[];
        static getImporter(type: string): Importer;
    }
}
declare namespace phasereditor2d.pack.ui.properties {
    import controls = colibri.ui.controls;
    class AssetPackItemSection extends controls.properties.PropertySection<core.AssetPackItem> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.properties {
    import controls = colibri.ui.controls;
    class AssetPackPreviewPropertyProvider extends controls.properties.PropertySectionProvider {
        addSections(page: controls.properties.PropertyPage, sections: controls.properties.PropertySection<any>[]): void;
    }
}
declare namespace phasereditor2d.pack.ui.properties {
    import controls = colibri.ui.controls;
    class ImagePreviewSection extends controls.properties.PropertySection<core.AssetPackItem> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        canEdit(obj: any): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.properties {
    import controls = colibri.ui.controls;
    class ManyImageSection extends controls.properties.PropertySection<any> {
        constructor(page: controls.properties.PropertyPage);
        protected createForm(parent: HTMLDivElement): void;
        private getImageFrames;
        canEdit(obj: any, n: number): boolean;
        canEditNumber(n: number): boolean;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    class AssetPackCellRendererProvider implements controls.viewers.ICellRendererProvider {
        private _layout;
        constructor(layout: "grid" | "tree");
        getCellRenderer(element: any): controls.viewers.ICellRenderer;
        private getIconRenderer;
        preload(element: any): Promise<controls.PreloadResult>;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    class AssetPackLabelProvider implements controls.viewers.ILabelProvider {
        getLabel(obj: any): string;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    class ImageAssetPackItemCellRenderer extends controls.viewers.ImageCellRenderer {
        getImage(obj: any): controls.IImage;
    }
}
declare namespace phasereditor2d.pack.ui.viewers {
    import controls = colibri.ui.controls;
    class ImageFrameContainerIconCellRenderer implements controls.viewers.ICellRenderer {
        renderCell(args: controls.viewers.RenderCellArgs): void;
        private getFrameImage;
        cellHeight(args: controls.viewers.RenderCellArgs): number;
        preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult>;
    }
}
//# sourceMappingURL=plugin.d.ts.map