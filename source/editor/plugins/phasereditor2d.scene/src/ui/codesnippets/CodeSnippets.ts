namespace phasereditor2d.scene.ui.codesnippets {

    export class CodeSnippets {

        private _list: CodeSnippet[] = [];

        add(snippet: CodeSnippet) {

            this._list.push(snippet);
        }

        removeByIds(ids: string[]) {

            const removeSet = new Set(ids);

            this._list = this._list.filter(s => !removeSet.has(s.getId()));
        }

        getSnippets() {

            return this._list;
        }

        readJSON(codeSnippets: ICodeSnippetData[]) {

            this._list = [];

            for (const snippetData of codeSnippets) {

                const ext = ScenePlugin.getInstance().getCodeSnippetExtensionByType(snippetData.type);

                if (ext) {

                    const snippet = ext.createEmptyCodeSnippet();

                    snippet.readJSON(snippetData);

                    this.add(snippet);
                }
            }
        }

        toJSON(): ICodeSnippetData[] {

            const result: ICodeSnippetData[] = [];

            for (const snippet of this._list) {

                const data: ICodeSnippetData = {} as any;

                snippet.writeJSON(data);

                result.push(data);
            }

            return result;
        }
    }
}