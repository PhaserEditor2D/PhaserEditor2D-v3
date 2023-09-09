namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpinePreviewDialog extends controls.dialogs.Dialog {
        private _leftArea: HTMLDivElement;
        private _rightArea: HTMLDivElement;
        private _previewManager: SpinePreviewManager;
        private _currentTrack = 0;
        private _trackAnimationMap: Map<number, string> = new Map();
        private _trackBtn: HTMLButtonElement;
        private _skinBtn: HTMLButtonElement;
        private _animBtn: HTMLButtonElement;
        private _spineAsset: pack.core.SpineAssetPackItem;
        private _spineAtlasAsset: pack.core.SpineAtlasAssetPackItem;
        private _skinName: string;
        private _currentLoop = true;

        constructor(spineAsset: pack.core.SpineAssetPackItem, spineAtlasAsset?: pack.core.SpineAtlasAssetPackItem, skinName?: string) {
            super();

            this.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5);

            this._spineAsset = spineAsset;
            this._spineAtlasAsset = spineAtlasAsset;
            this._skinName = skinName;
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

            if (!this._skinName) {

                const skeleton = this._spineAsset.getGuessSkeleton();

                this._skinName = skeleton.defaultSkin?.name;
            }

            const parentElement = this._leftArea;

            const builder = new controls.properties.FormBuilder();

            // Skins

            {
                builder.createLabel(parentElement, "Skin");

                this._skinBtn = builder.createMenuButton(parentElement, this._skinName ?? "",
                    () => this._spineAsset.getGuessSkinItems().map(s => ({
                        name: s.skinName,
                        value: s.skinName
                    })), skin => {

                        this._skinBtn.textContent = skin;

                        this._previewManager.setSkin(skin);
                    });

                if (this._skinName) {

                    this._skinBtn.textContent = this._skinName;
                }
            }

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

                let animations = this._spineAsset.getGuessSkeleton().animations.map(a => a.name);
                animations = [null, ...animations,]

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

            // Events
            {
                const check = builder.createCheckbox(parentElement, builder.createLabel(parentElement, "Events"));

                check.addEventListener("change", () => {

                    this._previewManager.setDisplayEvents(check.checked);

                    localStorage.setItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.events", check.checked ? "1" : "0");
                });

                check.checked = (localStorage.getItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.events") || "1") === "1";
            }

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

            // Time Scale
            {
                builder.createLabel(parentElement, "Time Scale");

                const text = builder.createText(parentElement);

                text.value = localStorage.getItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.timeScale") ?? "1";

                text.addEventListener("change", () => {

                    const n = Number(text.value);

                    this._previewManager.setTimeScale(n);

                    localStorage.setItem("phasereditor2d.scene.ui.sceneobjects.SpinePreviewDialog.timeScale", n.toString());
                });
            }

            // game canvas

            setTimeout(() => {

                this._previewManager.createGame({
                    spineAsset: this._spineAsset,
                    spineAtlasAsset: this._spineAtlasAsset,
                    skinName: this._skinName
                });
            }, 10);
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

            this.setTitle("Spine Preview");

            this.addButton("Close", () => this.close());

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}