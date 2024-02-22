namespace colibri.ui.controls {

    export class ColorPickerManager {

        private static _currentPicker: Picker;
        private static _set = false;

        static createPicker() {

            this.setupPicker();

            this._currentPicker = new Picker(document.body);

            return this._currentPicker;
        }

        static isActivePicker() {

            const picker = ColorPickerManager._currentPicker;

            if (picker) {

                const elem = picker.domElement as HTMLElement;

                return elem.isConnected;
            }

            return false;
        }

        static closeActive() {

            const picker = ColorPickerManager._currentPicker;

            if (picker) {

                this._currentPicker = null;

                picker.onClose(null);

                picker.destroy();
            }
        }

        private static setupPicker() {

            if (this._set) {

                return;
            }

            window.addEventListener("keydown", e => {

                if (e.code === "Escape") {

                    const picker = ColorPickerManager._currentPicker;

                    if (picker) {

                        if (ColorPickerManager.isActivePicker()) {

                            e.preventDefault();
                            e.stopImmediatePropagation();

                            ColorPickerManager.closeActive();
                        }
                    }
                }
            });
        }
    }
}