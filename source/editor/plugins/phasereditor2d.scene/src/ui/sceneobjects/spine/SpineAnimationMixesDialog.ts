namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineMixesDialog extends controls.dialogs.Dialog {
        private _leftArea: HTMLDivElement;
        private _rightArea: HTMLDivElement;
        private _previewManager: SpinePreviewManager;
        private _currentTrack = 0;
        private _trackAnimationMap: Map<number, string> = new Map();
        private _trackBtn: HTMLButtonElement;
        private _skinBtn: HTMLButtonElement;
        private _animBtn: HTMLButtonElement;
        private _currentLoop = true;
        private _spineObject: SpineObject;

        constructor(spineObject: SpineObject) {
            super();

            this.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);

            this._spineObject = spineObject;
        }

        protected createDialogArea(): void {

            this.createLeftArea();

            this.createRightArea();

            const clientArea = document.createElement("div")

            clientArea.classList.add("DialogClientArea");

            const style = clientArea.style;

            style.display = "grid";
            style.gridTemplateColumns = "1fr 2fr";
            style.gridTemplateRows = "1fr";
            style.width = "100%";
            style.height = "100%";
            style.minHeight = "0";

            clientArea.appendChild(this._leftArea);
            clientArea.appendChild(this._rightArea);

            this.getElement().appendChild(clientArea);
        }

        private createRightArea() {

            this._rightArea = document.createElement("div");

            const style = this._rightArea.style;

            style.width = "100%";
            style.height = "100%";

            this._previewManager = new SpinePreviewManager(this._rightArea);
        }

        private createLeftArea() {

            this._leftArea = document.createElement("div");

            const style = this._leftArea.style;

            style.width = "100%";
            style.display = "grid";
            style.gridTemplateColumns = "auto 1fr";
            style.gridAutoRows = "min-content"
            style.alignItems = "center";
            style.gap = "5px";
            style.overflow = "auto";
            style.padding = "5px";
            style.boxSizing = "border-box";
        }

        private createUI() {

            const parentElement = this._leftArea;

            const builder = new controls.properties.FormBuilder();

            this.createPreviewSettings(builder, parentElement);

            // Mixes

            this.createMixesSettings(parentElement, builder);

            // game canvas

            setTimeout(() => {

                const cache = this._spineObject.getEditorSupport().getScene().getPackCache();

                const spineAsset = cache.findAsset(this._spineObject.dataKey) as pack.core.SpineAssetPackItem;
                const spineAtlas = cache.findAsset(this._spineObject.atlasKey) as pack.core.SpineAtlasAssetPackItem;

                this._previewManager.createGame(spineAsset, spineAtlas, this._spineObject.skeleton.skin?.name);

            }, 10);
        }

        private createPreviewSettings(builder: controls.properties.FormBuilder, parentElement: HTMLDivElement) {
            
            builder.createSeparator(parentElement, "PREVIEW", "1 / span 2");

            // Track

            {
                builder.createLabel(parentElement, "Track");

                this._trackBtn = builder.createMenuButton(parentElement, "Track 0", () => [0, 1, 2, 3, 4, 5].map(t => ({
                    name: this.getTrackName(t),
                    value: t
                })), track => {

                    this._currentTrack = track;

                    this._trackBtn.textContent = this.getTrackName(track);
                });
            }

            // Animations

            {

                builder.createLabel(parentElement, "Animation");

                let animations = this._spineObject.skeleton.data.animations.map(a => a.name);
                animations = [null, ...animations,];

                this._animBtn = builder.createMenuButton(
                    parentElement, "EMPTY", () => animations.map(a => ({
                        name: a ?? "EMPTY",
                        value: a
                    })), animation => {

                        this._animBtn.textContent = animation ?? "EMPTY";

                        if (animation) {

                            this._trackAnimationMap.set(this._currentTrack, animation);

                        } else {

                            this._trackAnimationMap.delete(this._currentTrack);
                        }

                        this._previewManager.setAnimation(this._currentTrack, animation, this._currentLoop);

                        this._trackBtn.textContent = this.getTrackName(this._currentTrack);
                    });
            }

            // Loop

            {
                const check = builder.createCheckbox(parentElement, builder.createLabel(parentElement, "Loop"));

                check.addEventListener("change", () => {

                    this._currentLoop = check.checked;
                });

                check.checked = true;
            }
        }

        createMixesSettings(parentElement: HTMLDivElement, builder: controls.properties.FormBuilder) {

            builder.createSeparator(parentElement, "Mixes", "1 / span 2");

            // Mix Time

            {
                builder.createLabel(parentElement, "Default Mix");

                const text = builder.createText(parentElement);

                text.value = localStorage.getItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.mixTime") ?? "0";

                text.addEventListener("change", () => {

                    const n = Number(text.value);

                    this._previewManager.setMixTime(n);

                    localStorage.setItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.mixTime", n.toString());
                });
            }

             // Mixes

            {
                const mixesParent = document.createElement("div");
                mixesParent.style.display = "grid";
                mixesParent.style.gridTemplateColumns = "1fr 1fr 4em";
                mixesParent.style.gridColumn = "1 / span 2";

                parentElement.appendChild(mixesParent);

                const addMixBtn = builder.createButton(mixesParent, "Add Mix", () => { });

                addMixBtn.style.gridColumn = "1 / span 3";
            }
        }

        private getTrackName(track: any) {

            const animation = this._trackAnimationMap.has(track) ?
                ` (${this._trackAnimationMap.get(track)})` : "";

            const trackName = "Track " + track + animation;

            return trackName;
        }

        create(hideParentDialog?: boolean): void {

            super.create(hideParentDialog);

            this.createUI();

            this.setTitle("Spine Animation Mixes");

            this.addButton("Update", () => this.close());

            this.addCancelButton();

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}