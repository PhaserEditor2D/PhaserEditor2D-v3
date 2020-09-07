namespace phasereditor2d.animations.ui.editors {

    const ALPHA = new Set("abcdefghijklmnñopqrstuvwxyz".split(""));

    export interface IClusterElement {
        name: string;
        data: any;
    }

    export interface ICluster {

        prefix: string;

        elements: IClusterElement[]
    }

    export class NameClustersBuilder {

        private _elements: IClusterElement[];

        constructor() {

            this._elements = [];
        }

        addElement(element: IClusterElement) {

            this._elements.push(element);
        }

        build() {

            const clusters: ICluster[] = [];
            const map: Map<string, ICluster> = new Map();

            this._elements.sort((a, b) => a.name.localeCompare(b.name));

            for (const elem of this._elements) {

                const prefix = NameClustersBuilder.getPrefix(elem.name);

                let cluster: ICluster;

                if (map.has(prefix)) {

                    cluster = map.get(prefix);

                } else {

                    cluster = {
                        prefix: prefix,
                        elements: []
                    }

                    map.set(prefix, cluster);

                    clusters.push(cluster);
                }

                cluster.elements.push(elem);
            }

            return clusters;
        }

        static getPrefix(name: string) {

            let i = name.length - 1;

            while (i > 0) {

                const c = name.charAt(i);

                if (ALPHA.has(c)) {

                    break;
                }

                i--;
            }

            return name.substring(0, i + 1);
        }
    }
}