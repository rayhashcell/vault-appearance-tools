import { readFileSync, writeFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const manifestJson = JSON.parse(readFileSync("manifest.json", "utf8"));
const versionsJson = JSON.parse(readFileSync("versions.json", "utf8"));

const version = packageJson.version;

manifestJson.version = version;
versionsJson[version] = manifestJson.minAppVersion;

writeFileSync("manifest.json", `${JSON.stringify(manifestJson, null, "\t")}\n`);
writeFileSync("versions.json", `${JSON.stringify(versionsJson, null, "\t")}\n`);
