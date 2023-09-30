#!/bin/bash

cd ../source/editor/
npx colibri-packer --folder-to-json plugins/phasereditor2d.resources/_res
mv plugins/phasereditor2d.resources/_res.json plugins/phasereditor2d.resources/res.json