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

        renderValue(value: any): string {

            return value;
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
            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(
                () => new controls.viewers.EmptyCellRenderer(false)));
            viewer.setLabelProvider(new controls.viewers.LabelProvider());
            viewer.setStyledLabelProvider(new EventPropertyStyleLabelProider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            return viewer;
        }

        protected valueToString(viewer: colibri.ui.controls.viewers.TreeViewer, value: string): string {

            return value;
        }

        protected async loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer) {

            // Phaser events
            const docs = ScenePlugin.getInstance().getPhaserDocs();

            const phaserNames = docs.getKeys();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const events = await finder.findUserEvents();

            // user events

            const userNames = events.map(e => e.name);

            // Phaser animation dynamic events

            const packFinder = new pack.core.PackFinder();

            await packFinder.preload();

            const animEvents = packFinder
                .getAssets(i => i instanceof pack.core.AnimationsAssetPackItem)
                .map(i => i as pack.core.AnimationsAssetPackItem)
                .flatMap(i => i.getAnimations())
                .map(anim => anim.getKey())
                .map(k => `animationcomplete-${k}`);

            // Phaser keyboard dynamic events

            const keyboardEvents = [];

            for(const k of Object.keys(Phaser.Input.Keyboard.KeyCodes)) {

                keyboardEvents.push(`keydown-${k}`, `keyup-${k}`);
            }

            console.log(keyboardEvents);
            
            viewer.setInput([
                ...userNames,
                ...phaserNames,
                ...keyboardEvents,
                ...animEvents]);
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

            const userEvents: core.json.IUserEvent[] = [];

            ScenePlugin.getInstance().getSceneFinder().findUserEvents().then(events => {

                userEvents.push(...events);
            })

            viewer.eventSelectionChanged.addListener(sel => {

                const [eventName] = sel as string[];

                const phaserDocs = ScenePlugin.getInstance().getPhaserDocs();

                if (eventName) {

                    let help = "";

                    if (eventName.startsWith("Phaser.")) {

                        help = phaserDocs.getDoc(eventName, false) || "";

                    } else if (eventName.startsWith("animationcomplete-")) {

                        help = phaserDocs.getDoc("Phaser.Animations.Events.ANIMATION_COMPLETE_KEY", false);

                    } else if (eventName.startsWith("keydown-")) {

                        help = phaserDocs.getDoc("Phaser.Input.Keyboard.Events.KEY_DOWN", false);

                    } if (eventName.startsWith("keyup-")) {

                        help = phaserDocs.getDoc("Phaser.Input.Keyboard.Events.KEY_UP", false);

                    } else {

                        const event = userEvents.find(e => e.name === eventName);

                        if (event) {

                            help = phasereditor2d.ide.core.PhaserDocs.markdownToHtml(event.help)
                        }
                    }

                    docsArea.innerHTML = help;
                }
            });
        }
    }

    class EventPropertyStyleLabelProider implements controls.viewers.IStyledLabelProvider {

        getStyledTexts(obj: any, dark: boolean): controls.viewers.IStyledText[] {

            const label = obj as string;
            const i = label.lastIndexOf(".");
            const namespace_ = label.substring(0, i + 1);
            const name = label.substring(i + 1);

            const theme = controls.Controls.getTheme();

            return [
                {
                    color: theme.viewerForeground + "90",
                    text: namespace_
                },
                {
                    color: theme.viewerForeground,
                    text: name
                }
            ];
        }
    }
}