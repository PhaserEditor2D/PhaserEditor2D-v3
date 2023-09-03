namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpineMixesDialog extends controls.dialogs.Dialog {
        private _leftArea: HTMLDivElement;
        private _rightArea: HTMLDivElement;
        private _previewManager: SpinePreviewManager;
        private _currentTrack = 0;
        private _trackAnimationMap: Map<number, string> = new Map();
        private _trackBtn: HTMLButtonElement;
        private _animBtn: HTMLButtonElement;
        private _currentLoop = true;
        private _spineObject: SpineObject;
        private _animationMixes: IAnimationMixes;
        private _mixesParent: HTMLDivElement;
        private _defaultMix: number;

        constructor(spineObject: SpineObject) {
            super();

            this.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);

            this._spineObject = spineObject;

            this._animationMixes = [...(spineObject.animationMixes || [])];

            this._defaultMix = spineObject.defaultMix;
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
                const spineAtlasAsset = cache.findAsset(this._spineObject.atlasKey) as pack.core.SpineAtlasAssetPackItem;
                const skinName = this._spineObject.skeleton.skin?.name;
                const animationMixes = this._spineObject.animationMixes;

                this._previewManager.createGame({
                    spineAsset,
                    spineAtlasAsset,
                    skinName,
                    animationMixes,
                });

            }, 10);
        }

        private createPreviewSettings(builder: controls.properties.FormBuilder, parentElement: HTMLDivElement) {

            builder.createSeparator(parentElement, "PREVIEW", "1 / span 2");

            // Track

            {
                builder.createLabel(parentElement, "Preview Track");

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

                builder.createLabel(parentElement, "Preview Animation");

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
                const check = builder.createCheckbox(parentElement, builder.createLabel(parentElement, "Preview Loop"));

                check.addEventListener("change", () => {

                    this._currentLoop = check.checked;
                });

                check.checked = true;
            }
        }

        private createMixesSettings(parentElement: HTMLDivElement, builder: controls.properties.FormBuilder) {

            builder.createSeparator(parentElement, "Mixes", "1 / span 2");

            // Mix Time

            {
                builder.createLabel(parentElement, "Default Mix");

                const text = builder.createText(parentElement);

                // TODO
                text.value = this._defaultMix.toString();

                text.addEventListener("change", () => {

                    const n = Number(text.value);

                    if (Number.isNaN(n)) {

                        text.value = this._defaultMix.toString();

                        return;
                    }

                    this._defaultMix = n;

                    this._previewManager.setMixTime(n);
                });
            }

            // Mixes

            {
                this._mixesParent = document.createElement("div");
                this._mixesParent.style.display = "grid";
                this._mixesParent.style.gap = "5px";
                this._mixesParent.style.gridTemplateColumns = "1fr 1fr 3em auto";
                this._mixesParent.style.gridColumn = "1 / span 2";
                this._mixesParent.style.alignItems = "center";

                parentElement.appendChild(this._mixesParent);

                for (const mix of this._animationMixes) {

                    this.createMixRow(builder, mix);
                }

                const addMixBtn = builder.createButton(this._mixesParent, "Add Mix", () => {

                    const animations = this._spineObject.skeleton.data.animations.map(a => a.name);

                    const mix: IAnimationMix = [animations[0], animations[0], 0];

                    this._animationMixes.push(mix);

                    this.createMixRow(builder, mix);
                });

                addMixBtn.style.gridColumn = "1 / span 4";
            }
        }

        private createMixRow(builder: controls.properties.FormBuilder, mix: IAnimationMix) {

            const animations = this._spineObject.skeleton.data.animations.map(a => a.name);

            const ui: { fromBtn?: HTMLButtonElement, toBtn?: HTMLButtonElement, durationText?: HTMLInputElement } = {};

            // From

            ui.fromBtn = builder.createMenuButton(
                this._mixesParent, mix[0], () => animations.map(a => ({
                    name: a,
                    value: a
                })), animation => {

                    ui.fromBtn.textContent = animation;
                    mix[0] = animation;

                    this.emitUpdateAnimationMixes();
                });

            // To

            ui.toBtn = builder.createMenuButton(
                this._mixesParent, mix[1], () => animations.map(a => ({
                    name: a,
                    value: a
                })), animation => {

                    ui.toBtn.textContent = animation;
                    mix[1] = animation;

                    this.emitUpdateAnimationMixes();
                });

            ui.durationText = builder.createText(this._mixesParent);
            ui.durationText.addEventListener("change", () => {

                const n = Number.parseFloat(ui.durationText.value);

                if (Number.isNaN(n)) {

                    ui.durationText.value = mix[2].toString();

                } else {

                    mix[2] = n;
                }

                this.emitUpdateAnimationMixes();
            });
            ui.durationText.value = mix[2].toString();

            // Del

            const delControl = builder.createIcon(this._mixesParent, colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_DELETE), true);

            delControl.getCanvas().addEventListener("click", () => {

                this._animationMixes = this._animationMixes.filter(m => m !== mix);

                this.emitUpdateAnimationMixes();

                ui.fromBtn.remove();

                ui.toBtn.remove();

                ui.durationText.remove();

                delControl.getCanvas().remove();
            });
        }

        private emitUpdateAnimationMixes() {

            this._previewManager.setAnimationMixes(this._animationMixes);
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

            this.addButton("Update", () => {

                const newMixes = this._animationMixes.length === 0 ?
                    undefined : [...this._animationMixes];

                SpineComponent.animationMixes.setValue(this._spineObject, newMixes);
                SpineComponent.defaultMix.setValue(this._spineObject, this._defaultMix);

                this.close();
            });

            this.addCancelButton();

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}