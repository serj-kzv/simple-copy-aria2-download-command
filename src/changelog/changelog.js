import migration1Fn from "../changelog/migration1Fn.js";
import migration2Fn from "../changelog/migration2Fn.js";
import migration3Fn from "../changelog/migration3Fn.js";

const changelog = [
    {name: 'migration1Fn', migrationFn: migration1Fn},
    {name: 'migration2Fn', migrationFn: migration2Fn},
    {name: 'migration3Fn', migrationFn: migration3Fn}
];

export default changelog;