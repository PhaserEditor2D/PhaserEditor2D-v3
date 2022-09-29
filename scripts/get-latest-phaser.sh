cd ..

export PHASER=~/Documents/Phaser/phaser
export PHASER_DIST=$PHASER/dist
export PHASER_TYPES=$PHASER/types
export PHASER_PLUGIN=source/editor/plugins/phasereditor2d.phaser

# phaser dist

rm -R $PHASER_PLUGIN/scripts/*.js
cp $PHASER_DIST/phaser.js $PHASER_PLUGIN/scripts/
cp $PHASER_DIST/phaser.min.js $PHASER_PLUGIN/scripts/

# phaser types

cp $PHASER_TYPES/phaser.d.ts  $PHASER_PLUGIN/src/phaser/phaser.ts
cp $PHASER_TYPES/matter.d.ts  $PHASER_PLUGIN/src/phaser/matter.ts



