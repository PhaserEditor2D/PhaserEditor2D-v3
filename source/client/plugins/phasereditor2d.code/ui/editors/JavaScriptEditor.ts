/// <reference path="./MonacoEditor.ts" />

namespace phasereditor2d.code.ui.editors {

    export class JavaScriptEditorFactory extends MonacoEditorFactory {

        constructor() {
            super("javascript", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT);
        }

        createEditor(): colibri.ui.ide.EditorPart {
            return new JavaScriptEditor();
        }
    }


    function registerJavaScriptEditorCompletions() {

        monaco.languages.registerCompletionItemProvider("javascript", {

            provideCompletionItems: (model, pos) => {

                return {
                    suggestions: computeCompletionItems(),
                }
            }
        });
    }

    function computeCompletionItems(): monaco.languages.CompletionItem[] {

        const result: monaco.languages.CompletionItem[] = [];

        //TODO: missing preload finder, but we need to compute the completions async, we should look in the monaco docs.
        const finder = new pack.core.PackFinder();
        const packs = finder.getPacks();

        for (const pack_ of packs) {

            const packName = pack_.getFile().getName();

            for (const item of pack_.getItems()) {

                result.push(<any>{
                    label: `${item.getKey()}`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    documentation:
                        `Asset Pack key of type ${item.getType()} (in ${packName}).`,
                    insertText: `"${item.getKey()}"`,
                });

                if (item instanceof pack.core.ImageFrameContainerAssetPackItem
                    && !(item instanceof pack.core.ImageAssetPackItem)) {

                    for (const frame of item.getFrames()) {

                        result.push(<any>{
                            label: `${frame.getName()}`,
                            kind: monaco.languages.CompletionItemKind.Text,
                            documentation:
                                `Frame of the ${item.getType()} ${item.getKey()} (in ${packName}).`,
                            insertText: `"${frame.getName()}"`,
                        });
                    }
                }
            }
        }

        return result;
    }

    export class JavaScriptEditor extends MonacoEditor {

        private static _init = false;

        constructor() {
            super("javascript");

            if (!JavaScriptEditor._init) {
                JavaScriptEditor._init = true;
                JavaScriptEditor.init();
            }
        }

        private static init() {

            registerJavaScriptEditorCompletions();

        }

        createPart() {

            super.createPart();

            const editor = this.getMonacoEditor();

            editor.onDidChangeCursorPosition(e => {

                const model = editor.getModel();

                const str = getStringTokenValue(model, e.position);

                if (str) {

                    this.setSelection([str]);

                    const finder = new pack.core.PackFinder();

                    finder.preload().then(() => {

                        const obj = finder.findPackItemOrFrameWithKey(str);

                        this.setSelection([obj]);
                    });

                } else if (this.getSelection().length > 0) {

                    this.setSelection([]);
                }
            });

        }

        private _propertyProvider = new pack.ui.properties.AssetPackPreviewPropertyProvider();

        getPropertyProvider() {
            return this._propertyProvider;
        }
    }

    function getStringTokenValue(model: monaco.editor.ITextModel, pos: monaco.IPosition) {

        const input = model.getLineContent(pos.lineNumber);

        const cursor = pos.column - 1;

        let i = 0;
        let tokenOffset = 0;
        let openChar = "";

        while (i < input.length) {

            const c = input[i];

            if (openChar === c) {

                // end string token

                if (cursor >= tokenOffset && cursor <= i) {

                    return input.slice(tokenOffset, i);
                }

                openChar = "";

            } else if (c === "'" || c === '"') {

                // start string token

                openChar = c;

                tokenOffset = i + 1;
            }

            i++;
        }
    }
}