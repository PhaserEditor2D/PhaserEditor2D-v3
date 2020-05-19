namespace colibri.ui.controls {

    export class ColorPickerManager {

        private static _currentPicker;
        private static _set = false;

        static createPicker() {

            this.setupPicker();

            const pickerClass = window["Picker"];

            const picker = new pickerClass(document.body);

            this._currentPicker = picker;

            return picker;
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

                picker.destroy();

                this._currentPicker = null;
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