import GLib from "gi://GLib";
import { bindtextdomain, textdomain } from "gettext";

import Application from "./application.js";

GLib.set_prgname("re.sonny.Playhouse");
GLib.set_application_name("Playhouse");

export default function main(argv, { version, datadir }) {
  bindtextdomain(
    "re.sonny.Playhouse",
    GLib.build_filenamev([datadir, "locale"]),
  );
  textdomain("re.sonny.Playhouse");

  const application = Application({ version, datadir });

  application.run(argv);
}
