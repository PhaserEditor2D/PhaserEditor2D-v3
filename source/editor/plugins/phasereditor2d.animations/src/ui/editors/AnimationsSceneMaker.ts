namespace phasereditor2d.animations.ui.editors {

    export class AnimationsSceneMaker extends scene.ui.BaseSceneMaker {

        createScene(data: Phaser.Types.Animations.JSONAnimations, errors?: string[]) {

            const scene = this.getScene();

            scene.anims.fromJSON(data, true);

            for (const animData of data.anims) {

                const sprite = scene.add.sprite(0, 0, null);

                sprite.setDataEnabled();

                try {

                    sprite.anims.play(animData.key);

                } catch (e) {

                    console.error(e);
                }
            }

            for (const anim of scene.anims["anims"].getArray()) {

                for (const frame of anim.frames) {

                    AnimationsEditor.setAnimationToFrame(frame, anim);
                }
            }
        }

        async buildDependenciesHash(): Promise<string> {

            const builder = new phasereditor2d.ide.core.MultiHashBuilder();

            this.getScene().getPackCache().buildAssetsDependenciesHash(builder);

            const hash = builder.build();

            return hash;
        }

        async updateSceneLoader(data: IAnimationsData, monitor?: colibri.ui.controls.IProgressMonitor) {

            const scene = this.getScene();

            const finder = this.getPackFinder();

            const assets = [];

            for (const anim of data.anims) {

                for (const frame of anim.frames) {

                    const image = finder.getAssetPackItemImage(frame.key, frame.frame);

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