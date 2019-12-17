namespace colibri.ui.ide {

    export class EditorRegistry {

        private _map: Map<string, EditorFactory>;

        constructor() {
            this._map = new Map();
        }

        registerFactory(factory: EditorFactory): void {
            this._map.set(factory.getId(), factory);
        }

        getFactoryForInput(input: any): EditorFactory {

            for (const factory of this._map.values()) {
                
                if (factory.acceptInput(input)) {
                    return factory;
                }
            }

            return null;
        }
    }
}