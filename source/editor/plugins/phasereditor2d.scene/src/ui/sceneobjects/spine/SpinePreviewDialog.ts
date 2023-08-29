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

        constructor() {
            super();

            this.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
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

        previewSpine(spineAsset: pack.core.SpineAssetPackItem, spineAtlasAsset?: pack.core.SpineAtlasAssetPackItem, skinName?: string) {

            const parentElement = this._leftArea;

            const builder = new controls.properties.FormBuilder();

            // Skins

            {
                builder.createLabel(parentElement, "Skins");

               this._skinBtn = builder.createMenuButton(parentElement, skinName ?? "",
                    () => spineAsset.getGuessSkinItems().map(s => ({
                        name: s.skinName,
                        value: s.skinName
                    })), skin => {

                        this._skinBtn.textContent = skin;

                        this._previewManager.setSkin(skin);
                    });
                
                    if (skinName) {

                        this._skinBtn.textContent = skinName;
                    }
            }

            // Animations

            {

                builder.createLabel(parentElement, "Animations");

                let animations = spineAsset.getGuessSkeleton().animations.map(a => a.name);
                animations = [null, ...animations,]

                this._animBtn = builder.createMenuButton(parentElement, "EMPTY", () => animations.map(a => ({
                    name: a ?? "EMPTY",
                    value: a
                })), animation => {

                    this._animBtn.textContent = animation ?? "EMPTY";
                    
                    if (animation) {

                        this._trackAnimationMap.set(this._currentTrack, animation);

                    } else {

                        this._trackAnimationMap.delete(this._currentTrack);
                    }

                    this._previewManager.setAnimation(animation, this._currentTrack);

                    this._trackBtn.textContent = this.getTrackName(this._currentTrack);
                });
            }

            // Tracks

            {
                builder.createLabel(parentElement, "Tracks");

                this._trackBtn = builder.createMenuButton(parentElement, "Track 0", () => [0, 1, 2, 3, 4, 5].map(t => ({
                    name: this.getTrackName(t),
                    value: t
                })), track => {

                    this._currentTrack = track;

                    this._trackBtn.textContent = this.getTrackName(track);
                });
            }

            setTimeout(() => {

                this._previewManager.createGame(spineAsset, spineAtlasAsset, skinName);

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

            this.setTitle("Spine Preview");

            this.addButton("Close", () => this.close());

            this.eventDialogClose.addListener(() => {

                this._previewManager.dispose();
            })
        }
    }
}