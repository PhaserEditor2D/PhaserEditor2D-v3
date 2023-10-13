/// <reference path="./UserPropertyType.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class EventPropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "event",
                dialogTitle: "Select Event",
                name: "Event Dialog",
                hasCustomIcon: false
            });
        }

        getName() {

            return "Event";
        }

        private isPhaserBuiltIn(value: string) {

            return value.startsWith("Phaser.");
        }

        private getCodeValue(value: string) {

            if (this.isPhaserBuiltIn(value)) {

                return value;
            }

            return `"${value}"`;
        }

        protected createDialogInstance(viewer: controls.viewers.TreeViewer, zoom: boolean) {

            return new EventPropertyDialog(viewer);
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            const codeValue = this.getCodeValue(value);

            return this.buildExpressionFieldCode(prop, "string", codeValue);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            const prop = userProp.getComponentProperty();
            const value = prop.getValue(args.obj);

            if (this.isPhaserBuiltIn(value)) {

                comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, prop);

            } else {

                comp.buildSetObjectPropertyCodeDOM_StringProperty(args, prop);
            }
        }

        protected async createViewer() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.editor.EventPropertyType.Dialog");
            viewer.setCellRendererProvider(new EventCellRendererProvider());
            viewer.setLabelProvider(new EventLabelProvider());
            viewer.setStyledLabelProvider(new EventPropertyStyleLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            return viewer;
        }

        protected valueToString(viewer: colibri.ui.controls.viewers.TreeViewer, value: EventItem): string {

            return value.eventName;
        }

        protected async loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer) {

            // Phaser events
            const eventsDocs = ScenePlugin.getInstance().getPhaserEventsDocs();

            const phaserEventNames = eventsDocs.getKeys().map(k => new PhaserEventItem(k));

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const events = await finder.findUserEvents();

            // user events

            const userNames = events.map(e => new UserEventItem(e));

            // Phaser animation dynamic events

            const packFinder = new pack.core.PackFinder();

            await packFinder.preload();

            const animEvents = packFinder
                .getAssets(i => i instanceof pack.core.BaseAnimationsAssetPackItem)
                .map(i => i as pack.core.BaseAnimationsAssetPackItem)
                .flatMap(i => i.getAnimations())
                .map(anim => new AnimationEventItem(`animationcomplete-${anim.getKey()}`, anim));

            // Spine skeletons dynamic events

            const spineEvents = (await SpineUtils.getSpineEventItems()).map(e => new SkeletonEventItem(e));

            // Phaser keyboard dynamic events

            const keyboardEvents: KeyboardEvent[] = [];

            for (const k of Object.keys(Phaser.Input.Keyboard.KeyCodes)) {

                keyboardEvents.push(
                    new KeyboardEvent(`keydown-${k}`),
                    new KeyboardEvent(`keyup-${k}`));
            }

            viewer.setInput([
                ...userNames,
                ...phaserEventNames,
                ...keyboardEvents,
                ...animEvents,
                ...spineEvents]);
        }
    }

    abstract class EventItem {

        constructor(public eventName: string) {
        }

        protected getPhaserHelp(eventName: string) {

            const docs = ScenePlugin.getInstance().getPhaserEventsDocs();

            return docs.getDoc(eventName, false) || "";
        }

        abstract getHelp(): Promise<string>;
    }

    class PhaserEventItem extends EventItem {

        public phaserNamespace: string;
        public constantName: string;

        constructor(eventName: string) {
            super(eventName);

            const label = eventName;
            const i = label.lastIndexOf(".");
            this.phaserNamespace = label.substring(0, i + 1);
            this.constantName = label.substring(i + 1);
        }

        async getHelp(): Promise<string> {

            return this.getPhaserHelp(this.eventName);
        }
    }

    class UserEventItem extends EventItem {

        constructor(public userEvent: core.json.IUserEvent) {
            super(userEvent.name);
        }

        async getHelp(): Promise<string> {

            const userEvents = await ScenePlugin.getInstance().getSceneFinder().findUserEvents();

            const event = userEvents.find(e => e.name === this.eventName);

            if (event) {

                return phasereditor2d.ide.core.PhaserDocs.markdownToHtml(event.help)
            }

            return "";
        }
    }

    class AnimationEventItem extends EventItem {

        constructor(
            name: string,
            public animConfig: pack.core.AnimationConfigInPackItem) {

            super(name);
        }

        async getHelp(): Promise<string> {

            return this.getPhaserHelp("Phaser.Animations.Events.ANIMATION_COMPLETE_KEY");
        }
    }

    class KeyboardEvent extends EventItem {

        async getHelp(): Promise<string> {

            if (this.eventName.startsWith("keydown-")) {

                return this.getPhaserHelp("Phaser.Input.Keyboard.Events.KEY_DOWN");
            }

            return this.getPhaserHelp("Phaser.Input.Keyboard.Events.KEY_UP");
        }
    }

    class SkeletonEventItem extends EventItem {

        constructor(public spineEvent: pack.core.SpineEventItem) {
            super(spineEvent.eventName);
        }

        async getHelp(): Promise<string> {

            return "User spine event defined in the '" + this.spineEvent.spineAsset.getKey() + "' skeleton.";
        }
    }

    class EventPropertyDialog extends controls.dialogs.ViewerFormDialog {

        constructor(viewer: controls.viewers.TreeViewer) {
            super(viewer, false);

            this.setSize(undefined, 600, true);
        }

        protected createFormArea(formArea: HTMLDivElement): void {

            const docsArea = document.createElement("div");
            docsArea.innerHTML = "";

            formArea.appendChild(docsArea);
            formArea.classList.add("EventPropertyDialogHelpPane");

            const viewer = this.getViewer();

            viewer.eventSelectionChanged.addListener(async (sel: EventItem[]) => {

                const [item] = sel;

                docsArea.innerHTML = await item.getHelp();
            });
        }
    }

    class EventCellRendererProvider implements controls.viewers.ICellRendererProvider {

        constructor() {

        }

        getCellRenderer(element: any): controls.viewers.ICellRenderer {

            if (element instanceof AnimationEventItem) {

                return new AnimationEventCellRenderer();
            }

            else if (element instanceof SkeletonEventItem) {

                return new SpineEventCellRenderer();
            }

            let icon: controls.IImage;

            if (element instanceof UserEventItem) {

                icon = resources.getIcon(resources.ICON_FILE_TEXT);

            } else if (element instanceof KeyboardEvent) {

                icon = resources.getIcon(resources.ICON_KEYBOARD_KEY);

            } else {

                icon = resources.getIcon(resources.ICON_BUILD);
            }

            if (icon) {

                return new controls.viewers.IconImageCellRenderer(icon);
            }

            return new controls.viewers.EmptyCellRenderer();
        }

        async preload(args: controls.viewers.PreloadCellArgs): Promise<controls.PreloadResult> {

            return controls.PreloadResult.RESOURCES_LOADED;
        }
    }

    class AnimationEventCellRenderer extends pack.ui.viewers.AnimationConfigCellRenderer {

        getAnimationConfig(args: controls.viewers.RenderCellArgs | controls.viewers.PreloadCellArgs): pack.core.AnimationConfigInPackItem {

            const item = args.obj as AnimationEventItem;

            return item.animConfig;
        }
    }

    class SpineEventCellRenderer extends SpineSkinCellRenderer {

        protected getSkinItem(args: controls.viewers.RenderCellArgs | controls.viewers.PreloadCellArgs): pack.core.SpineSkinItem {

            const event = args.obj as SkeletonEventItem;

            const skins = event.spineEvent.spineAsset.getGuessSkinItems();

            return skins[Math.floor(skins.length / 2)];
        }
    }

    class EventLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: EventItem): string {

            if (obj instanceof SkeletonEventItem) {

                return obj.eventName + " - " + obj.spineEvent.spineAsset.getKey() + " (Spine)";
            }

            return obj.eventName;
        }
    }

    class EventPropertyStyleLabelProvider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: EventItem, dark: boolean): controls.viewers.IStyledText[] {

            const theme = controls.Controls.getTheme();

            if (obj instanceof PhaserEventItem) {

                return [
                    {
                        color: theme.viewerForeground + "90",
                        text: obj.phaserNamespace
                    },
                    {
                        color: theme.viewerForeground,
                        text: obj.constantName
                    }
                ];
            }

            if (obj instanceof SkeletonEventItem) {

                return [
                    {
                        color: theme.viewerForeground,
                        text: obj.eventName
                    },
                    {
                        color: theme.viewerForeground + "90",
                        text: " - " + obj.spineEvent.spineAsset.getKey() + " (Spine)"
                    }
                ];
            }

            return [{
                color: theme.viewerForeground,
                text: obj.eventName
            }];
        }
    }
}