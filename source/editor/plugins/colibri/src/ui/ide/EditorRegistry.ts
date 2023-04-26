namespace colibri.ui.ide {

    export class EditorRegistry {

        private _factories: EditorFactory[];
        private _defaultFactory: EditorFactory;

        constructor() {

            this._factories = [];
        }

        registerDefaultFactory(defaultFactory: EditorFactory) {

            this._defaultFactory = defaultFactory;
        }

        registerFactory(factory: EditorFactory): void {

            this._factories.push(factory);
        }

        getFactoryForInput(input: any): EditorFactory {

            for (const factory of this._factories) {

                if (factory.acceptInput(input)) {
                    
                    return factory;
                }
            }

            return this._defaultFactory;
        }

        getFactories() {

            return this._factories;
        }

        getFactoryByName(name: string) {

            return this._factories.find(f => f.getName() === name);
        }

        getDefaultFactory() {

            return this._defaultFactory;
        }
    }
}