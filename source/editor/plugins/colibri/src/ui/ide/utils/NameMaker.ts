namespace colibri.ui.ide.utils {

    declare type GetName = (obj: any) => string;

    export class NameMaker {

        private _getName: GetName;
        private _nameSet: Set<string>;

        constructor(getName: GetName) {
            this._getName = getName;
            this._nameSet = new Set();
        }

        update(objects: any[]) {

            for (const obj of objects) {

                const name = this._getName(obj);

                this._nameSet.add(name);
            }
        }

        static trimNumbering(name: string) {

            return name.replace(/[0-9 _-]+$/, "");
        }

        makeName(baseName: string) {

            if (this._nameSet.has(baseName)) {

                baseName = NameMaker.trimNumbering(baseName);

                let name: string;

                let i = 0;

                do {

                    name = baseName + (i === 0 ? "" : "_" + i);
                    i++;

                } while (this._nameSet.has(name));

                this._nameSet.add(name);

                return name;
            }

            return baseName;
        }
    }

}