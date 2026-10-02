/* eslint-disable @typescript-eslint/no-require-imports -- Established browser capture harness. */
const cp = require("node:child_process"),
  path = require("node:path");
for (const kind of ["capture", "coverage", "supplement"])
  cp.execFileSync(process.execPath, [path.join(__dirname, kind + ".cjs")], {
    stdio: "inherit",
  });
