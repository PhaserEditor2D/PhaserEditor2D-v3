var phasereditor2d;
(function (phasereditor2d) {
    var resources;
    (function (resources) {
        // phasereditor2d.blocks
        resources.ICON_BLOCKS = "blocks";
        // phasereditor2d.blocks
        resources.ICON_PLAY = "play";
        // phasereditor2d.outline
        resources.ICON_OUTLINE = "outline";
        // phasereditor2d.blocks
        resources.ICON_ASSET_PACK = "asset-pack";
        resources.ICON_ANIMATIONS = "animations";
        resources.ICON_ASEPRITE = "aseprite";
        resources.ICON_TILEMAP = "tilemap";
        resources.ICON_TILEMAP_LAYER = "tilemap-layer";
        resources.ICON_SPINE = "spine";
        // phasereditor2d.files
        resources.ICON_NEW_FILE = "file-new";
        resources.ICON_PROJECT = "project";
        // phasereditor2d.scene
        resources.ICON_GROUP = "group";
        resources.ICON_TRANSLATE = "translate";
        resources.ICON_ANGLE = "angle";
        resources.ICON_SCALE = "scale";
        resources.ICON_ORIGIN = "origin";
        resources.ICON_SELECT_REGION = "select-region";
        resources.ICON_BUILD = "build";
        resources.ICON_LOCKED = "locked";
        resources.ICON_UNLOCKED = "unlocked";
        resources.ICON_LIST = "list";
        resources.ICON_USER_COMPONENT = "user-component";
        resources.ICON_USER_PROPERTY = "dot";
        resources.ICON_IMAGE_TYPE = "image-type";
        resources.ICON_SPRITE_TYPE = "sprite-type";
        resources.ICON_TILESPRITE_TYPE = "tilesprite";
        resources.ICON_TEXT_TYPE = "text-type";
        resources.ICON_BITMAP_FONT_TYPE = "bitmapfont-type";
        resources.ICON_LAYER = "layer";
        resources.ICON_ALIGN_LEFT = "align-left";
        resources.ICON_ALIGN_CENTER = "align-center";
        resources.ICON_ALIGN_RIGHT = "align-right";
        resources.ICON_ALIGN_TOP = "align-top";
        resources.ICON_ALIGN_MIDDLE = "align-middle";
        resources.ICON_ALIGN_BOTTOM = "align-bottom";
        resources.ICON_BORDER_LEFT = "border-left";
        resources.ICON_BORDER_CENTER = "border-center";
        resources.ICON_BORDER_RIGHT = "border-right";
        resources.ICON_BORDER_TOP = "border-top";
        resources.ICON_BORDER_MIDDLE = "border-middle";
        resources.ICON_BORDER_BOTTOM = "border-bottom";
        resources.ICON_GRID = "grid";
        resources.ICON_COLUMN = "column";
        resources.ICON_ROW = "row";
        resources.ICON_ORIGIN_TOP_LEFT = "origin-topleft";
        resources.ICON_ORIGIN_TOP_CENTER = "origin-topcenter";
        resources.ICON_ORIGIN_TOP_RIGHT = "origin-topright";
        resources.ICON_ORIGIN_MIDDLE_LEFT = "origin-middleleft";
        resources.ICON_ORIGIN_MIDDLE_CENTER = "origin-middlecenter";
        resources.ICON_ORIGIN_MIDDLE_RIGHT = "origin-middleright";
        resources.ICON_ORIGIN_BOTTOM_LEFT = "origin-bottomleft";
        resources.ICON_ORIGIN_BOTTOM_CENTER = "origin-bottomcenter";
        resources.ICON_ORIGIN_BOTTOM_RIGHT = "origin-bottomright";
        resources.ICON_ARCADE_COLLIDER = "collider";
        resources.ICON_KEYBOARD_KEY = "keyboard-key";
        resources.ICON_9_SLICE = "9slice";
        resources.ICON_3_SLICE = "3slice";
        resources.ICON_FX = "fx";
        // phasereditor2d.webContentTypes
        resources.ICON_FILE_FONT = "file-font";
        resources.ICON_FILE_IMAGE = "file-image";
        resources.ICON_FILE_VIDEO = "file-movie";
        resources.ICON_FILE_SCRIPT = "file-script";
        resources.ICON_FILE_SOUND = "file-sound";
        resources.ICON_FILE_TEXT = "file-text";
        class ResourcesPlugin extends colibri.Plugin {
            // icons
            static _instance = new ResourcesPlugin();
            _res;
            static getInstance() {
                return this._instance;
            }
            constructor() {
                super("phasereditor2d.resources", {
                    loadIconsFromAtlas: true,
                    loadResources: true
                });
            }
        }
        resources.ResourcesPlugin = ResourcesPlugin;
        function getResString(key) {
            return ResourcesPlugin.getInstance().getResources().getResString(key);
        }
        resources.getResString = getResString;
        function getResData(key) {
            return ResourcesPlugin.getInstance().getResources().getResData(key);
        }
        resources.getResData = getResData;
        function getIcon(name) {
            return ResourcesPlugin.getInstance().getIcon(name);
        }
        resources.getIcon = getIcon;
        ;
        function getIconDescriptor(name) {
            return ResourcesPlugin.getInstance().getIconDescriptor(name);
        }
        resources.getIconDescriptor = getIconDescriptor;
        ;
        colibri.Platform.addPlugin(ResourcesPlugin.getInstance());
    })(resources = phasereditor2d.resources || (phasereditor2d.resources = {}));
})(phasereditor2d || (phasereditor2d = {}));
