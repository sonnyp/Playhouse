import GLib from "gi://GLib";
import { bindtextdomain, textdomain } from "gettext";

import Application from "./application.js";

GLib.set_prgname("re.sonny.Webground");
GLib.set_application_name("Webground");

export default function main(argv, { version, datadir }) {
  bindtextdomain(
    "re.sonny.Webground",
    GLib.build_filenamev([datadir, "locale"]),
  );
  textdomain("re.sonny.Webground");

  const application = Application({ version, datadir });

  application.run(argv);
}
