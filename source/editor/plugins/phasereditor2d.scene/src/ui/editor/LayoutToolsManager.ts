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

            const groupItemsToolbarElement = document.createElement("div");
            groupItemsToolbarElement.classList.add("Toolbar");
            centerPane.appendChild(groupItemsToolbarElement);
            groupItemsToolbarElement.style.display = "none";

            const groupToolbarElement = document.createElement("div");
            groupToolbarElement.classList.add("Toolbar");
            centerPane.appendChild(groupToolbarElement);

            const extsByGroup = ScenePlugin.getInstance().getLayoutExtensionsByGroup();

            const groupToolbar = new controls.ToolbarManager(groupToolbarElement);

            const actions: controls.Action[] = [];

            for (const group of extsByGroup) {

                if (group.extensions.length <= 3) {

                    for (const ext of group.extensions) {

                        const config = ext.getConfig();

                        const action = groupToolbar.addAction({
                            text: config.name,
                            icon: config.icon,
                            showText: false,
                            callback: (e, action) => {

                                this.clearParameters();

                                groupItemsToolbarElement.style.display = "none";
                                this.clearHtmlElementChildren(groupItemsToolbarElement);

                                for (const a of actions) {

                                    a.setSelected(false);
                                }

                                action.setSelected(true);

                                ext.performLayout(this._editor)
                            }
                        });

                        actions.push(action);
                    }

                } else {

                    const action = groupToolbar.addAction({
                        text: group.group,
                        showText: false,
                        icon: group.extensions[0].getConfig().icon,
                        callback: (e, action: controls.Action) => {

                            for (const a of actions) {

                                a.setSelected(false);
                            }

                            action.setSelected(true);

                            this.showGroupToolbar(groupItemsToolbarElement, group.group, group.extensions);
                        }
                    });

                    actions.push(action);
                }
            }

            this._editor.getCanvasContainer().appendChild(pane);

            this._pane = pane;

            {
                const item = window.localStorage.getItem("phasereditor2d.scene.ui.editor.layoutPaneVisible");

                this.setPaneVisible(item !== "false");
            }
        }

        private clearHtmlElementChildren(parent: HTMLElement) {

            while (parent.firstChild) {

                parent.removeChild(parent.firstChild)
            }
        }

        private showGroupToolbar(parent: HTMLDivElement, group: string, extensions: layout.LayoutExtension<layout.ILayoutExtensionConfig>[]): void {

            this.clearParameters();

            this.clearHtmlElementChildren(parent);

            parent.style.display = "initial";

            // the title pane

            const titlePane = document.createElement("div");
            titlePane.classList.add("Title");
            parent.appendChild(titlePane);

            const titleLabel = document.createElement("label");
            titleLabel.textContent = group;
            titlePane.appendChild(titleLabel);

            const buttonPane = document.createElement("div");
            buttonPane.classList.add("Buttons");
            titlePane.appendChild(buttonPane);

            const closeIcon = new controls.IconControl(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_CONTROL_CLOSE));
            closeIcon.getCanvas().classList.add("IconButton");
            closeIcon.getCanvas().addEventListener("click", () => {

                parent.style.display = "none";
                this.clearHtmlElementChildren(parent);
            });

            buttonPane.appendChild(closeIcon.getCanvas());

            // the toolbar

            const toolbar = new controls.ToolbarManager(parent);

            for (const ext of extensions) {

                const config = ext.getConfig();

                toolbar.addAction({
                    text: config.name,
                    icon: config.icon,
                    showText: false,
                    callback: () => ext.performLayout(this._editor)
                });
            }
        }

        private clearParameters() {

            while (this._parametersElement.firstChild) {

                this._parametersElement.removeChild(this._parametersElement.firstChild);
            }
        }

        async showParametersPane(ext: layout.TransformLayoutExtension) {

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

        private getLocalStorageKey(ext: layout.TransformLayoutExtension, key: string): string {

            const config = ext.getConfig();

            return "phasereditor2d.scene.ui.editor.LayoutToolsManager.parameters." + config.group + "." + config.name + "." + key;
        }
    }
}