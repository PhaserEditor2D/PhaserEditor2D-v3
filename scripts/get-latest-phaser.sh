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

rm -R $PHASER_PLUGIN/src/phaser/phaser.ts
rm -R $PHASER_PLUGIN/src/phaser/matter.ts

cp $PHASER_TYPES/phaser.d.ts  $PHASER_PLUGIN/src/phaser/phaser.ts
cp $PHASER_TYPES/matter.d.ts  $PHASER_PLUGIN/src/phaser/matter.ts

# templates

rm -f source/templates/include/lib/*
rm -f source/templates/include/types/*

cp $PHASER_DIST/phaser.js source/templates/include/lib/
cp $PHASER_TYPES/phaser.d.ts  source/templates/include/types/
cp $PHASER_TYPES/matter.d.ts  source/templates/include/types/



