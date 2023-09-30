cd ..

export SPINE_TYPES=$PHASEREDITOR_HOME/spine/spine-phaser-iife-types
export SPINE_RUNTIME=$SPINE_RUNTIMES/spine-ts/spine-phaser
export SPINE_PLUGIN=source/editor/plugins/phasereditor2d.spine

# spine dist

rm -Rf $SPINE_PLUGIN/scripts/*.js
cp $SPINE_RUNTIME/dist/iife/spine-phaser.min.js $SPINE_PLUGIN/scripts/
cp $SPINE_RUNTIME/dist/iife/spine-phaser.js $SPINE_PLUGIN/scripts/

# spine types

rm $SPINE_PLUGIN/src/spine/*.ts
cp $SPINE_TYPES/dist/phaser-globals.d.ts  $SPINE_PLUGIN/src/spine/phaser-globals.ts
cp $SPINE_TYPES/dist/spine-core.d.ts  $SPINE_PLUGIN/src/spine/spine-core.ts
cp $SPINE_TYPES/dist/spine-phaser.d.ts  $SPINE_PLUGIN/src/spine/spine-phaser.ts
cp $SPINE_TYPES/dist/spine-webgl.d.ts  $SPINE_PLUGIN/src/spine/spine-webgl.ts
