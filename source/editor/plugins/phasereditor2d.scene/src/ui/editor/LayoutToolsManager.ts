namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class LayoutToolsManager {
        private _pane: HTMLDivElement;
        private _editor: SceneEditor;
        private _paneVisible: boolean;
        _parametersElement: HTMLDivElement;

        constructor(editor: SceneEditor) {

            this._editor = editor;
        }

        togglePaneVisible() {

            this.setPaneVisible(!this.isPaneVisible());
        }

        setPaneVisible(visible: boolean) {

            this._paneVisible = visible;

            if (visible) {

                this._pane.style.display = "grid";

            } else {

                this._pane.style.display = "none";
            }

            window.localStorage.setItem("phasereditor2d.scene.ui.editor.layoutPaneVisible", visible ? "true" : "false");
        }

        isPaneVisible() {

            return this._paneVisible;
        }

        createElement() {

            const pane = document.createElement("div");
            pane.classList.add("LayoutPane");

            const centerPane = document.createElement("div");
            centerPane.classList.add("CenterPane", "Pane");
            pane.appendChild(centerPane);

            this._parametersElement = document.createElement("div");
            this._parametersElement.classList.add("Parameters");
            centerPane.appendChild(this._parametersElement);

            const toolbarElement = document.createElement("div");
            toolbarElement.classList.add("Toolbar");
            centerPane.appendChild(toolbarElement);

            const toolbar = new controls.ToolbarManager(toolbarElement);

            const extsByGroup = ScenePlugin.getInstance().getLayoutExtensionsByGroup();

            for (const groupSet of extsByGroup) {

                for (const ext of groupSet.extensions) {

                    const config = ext.getConfig();

                    toolbar.addAction({
                        text: config.name,
                        icon: config.icon,
                        showText: false,
                        callback: () => ext.performLayout(this._editor)
                    });
                }
            }

            this._editor.getCanvasContainer().appendChild(pane);

            this._pane = pane;

            this.setPaneVisible(window.localStorage.getItem("phasereditor2d.scene.ui.editor.layoutPaneVisible") === "true");
        }

        private clearParameters() {

            while (this._parametersElement.firstChild) {

                this._parametersElement.removeChild(this._parametersElement.firstChild);
            }
        }

        async showParametersPane(ext: layout.LayoutExtension) {

            const paneWasVisible = this.isPaneVisible();

            if (!paneWasVisible) {

                this.togglePaneVisible();
            }

            return new Promise((resolve, reject) => {

                const params = ext.getConfig().params || [];

                this.clearParameters();

                if (params.length === 0) {

                    resolve(null);

                    return;
                }

                const formParent = document.createElement("div");
                formParent.classList.add("Form");
                this._parametersElement.appendChild(formParent);

                const form = new controls.properties.EasyFormBuilder(formParent);

                const titlePane = document.createElement("div");
                titlePane.classList.add("Title");
                formParent.appendChild(titlePane);

                const titleLabel = document.createElement("label");
                titleLabel.textContent = ext.getConfig().name;
                titlePane.appendChild(titleLabel);

                const buttonPane = document.createElement("div");
                buttonPane.classList.add("Buttons");
                titlePane.appendChild(buttonPane);

                const applyIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CHECKED));
                applyIcon.getCanvas().classList.add("IconButton");
                applyIcon.getCanvas().addEventListener("click", () => {

                    applyResult();
                });
                buttonPane.appendChild(applyIcon.getCanvas());

                const closeIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE));
                closeIcon.getCanvas().classList.add("IconButton");
                closeIcon.getCanvas().addEventListener("click", () => {

                    this.clearParameters();
                    resolve(null);
                });
                buttonPane.appendChild(closeIcon.getCanvas());

                const elementMap: Map<string, HTMLInputElement> = new Map();

                const applyResult = () => {

                    const result = {};

                    for (const paramName of elementMap.keys()) {

                        const text = elementMap.get(paramName);

                        window.localStorage.setItem(this.getLocalStorageKey(ext, paramName), text.value);

                        const val = Number.parseFloat(text.value);

                        result[paramName] = val;
                    }

                    this.clearParameters();

                    if (!paneWasVisible) {

                        this.setPaneVisible(false);
                    }

                    resolve(result);
                }

                for (const param of params) {

                    form.createLabel(param.label);

                    const text = form.createText();

                    const memo = window.localStorage.getItem(this.getLocalStorageKey(ext, param.name));

                    text.value = memo || param.defaultValue.toString();

                    text.addEventListener("keypress", e => {

                        if (e.code === "Enter" || e.code === "NumpadEnter") {

                            applyResult();
                        }
                    })

                    elementMap.set(param.name, text);
                }
            });
        }

        private getLocalStorageKey(ext: layout.LayoutExtension, key: string): string {

            const config = ext.getConfig();

            return "phasereditor2d.scene.ui.editor.LayoutToolsManager.parameters." + config.group + "." + config.name + "." + key;
        }
    }
}