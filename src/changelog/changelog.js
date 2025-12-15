import migration1Fn from "../changelog/migration1Fn.js";
import migration2Fn from "../changelog/migration2Fn.js";
import migration3Fn from "../changelog/migration3Fn.js";
import migration4Fn from "../changelog/migration4Fn.js";
import migration5Fn from "../changelog/migration5Fn.js";
import migration6Fn from "../changelog/migration6Fn.js";
import migration7Fn from "../changelog/migration7Fn.js";
import migration8Fn from "../changelog/migration8Fn.js";
import migration9Fn from "../changelog/migration9Fn.js";

const changelog = [
    {name: 'migration1Fn', migrationFn: migration1Fn},
    {name: 'migration2Fn', migrationFn: migration2Fn},
    {name: 'migration3Fn', migrationFn: migration3Fn},
    {name: 'migration4Fn', migrationFn: migration4Fn},
    {name: 'migration5Fn', migrationFn: migration5Fn},
    {name: 'migration6Fn', migrationFn: migration6Fn},
    {name: 'migration7Fn', migrationFn: migration7Fn},
    {name: 'migration8Fn', migrationFn: migration8Fn},
    {name: 'migration9Fn', migrationFn: migration9Fn}
];

export default changelog;