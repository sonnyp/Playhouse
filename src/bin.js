#!@GJS@ -m

import { exit } from "system";
import GLib from "gi://GLib";
import { setConsoleLogDomain } from "console";

imports.package.init({
  name: "@app_id@",
  version: "@version@",
  prefix: "@prefix@",
  libdir: "@libdir@",
  datadir: "@datadir@",
});
setConsoleLogDomain(pkg.name);
GLib.set_application_name("Playhouse");

const loop = new GLib.MainLoop(null, false);
import("resource:///re/sonny/Playhouse/src/main.js")
  .then((main) => {
    // Workaround for issue
    // https://gitlab.gnome.org/GNOME/gjs/-/issues/468
    GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
      loop.quit();
      const exit_code = imports.package.run(main);
      exit(exit_code);
      return GLib.SOURCE_REMOVE;
    });
  })
  .catch(logError);
loop.run();
