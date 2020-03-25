namespace colibri.ui.ide {

    export class EditorRegistry {

        private _factories: EditorFactory[];

        constructor() {

            this._factories = [];
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

            return null;
        }
    }
}