namespace phasereditor2d.animations.ui.editors {

    export class AnimationsSceneMaker extends scene.ui.BaseSceneMaker {

        createScene(data: Phaser.Types.Animations.JSONAnimations, errors?: string[]) {

            const scene = this.getScene();

            scene.anims.fromJSON(data);

            let x = 10;
            let y = 10;

            for (const anim of data.anims) {

                const sprite = scene.add.sprite(x, y, null);

                sprite.play(anim.key);

                x += 100;
                y += 100;
            }
        }

        async buildDependenciesHash(): Promise<string> {

            const builder = new phasereditor2d.ide.core.MultiHashBuilder();

            this.getScene().getPackCache().buildAssetsDependenciesHash(builder);

            const hash = builder.build();

            return hash;
        }

        async updateSceneLoader(data: Phaser.Types.Animations.JSONAnimations, monitor?: colibri.ui.controls.IProgressMonitor) {

            const scene = this.getScene();

            const cache = scene.getPackCache();

            const assets = [];

            for (const anim of data.anims) {

                for (const frame of anim.frames) {

                    const image = cache.getImage(frame.key, frame.frame);

                    if (image) {

                        assets.push(image);
                    }
                }
            }

            monitor.addTotal(assets.length);

            for (const asset of assets) {

                const updater = phasereditor2d.scene.ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);

                if (updater) {

                    await updater.updateLoader(scene, asset);

                    if (monitor) {

                        monitor.step();
                    }
                }
            }
        }
    }
}