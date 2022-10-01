import Gtk from "gi://Gtk";
import Adw from "gi://Adw";
import GLib from "gi://GLib";
import { gettext as _ } from "gettext";
import WebKit from "gi://WebKit2?version=5.0";

import {
  getGIRepositoryVersion,
  getGjsVersion,
  getGLibVersion,
} from "../troll/src/util.js";

export default function About({ application }) {
  const debug_info = `
${GLib.get_os_info("ID")} ${GLib.get_os_info("VERSION_ID")}

GJS ${getGjsVersion()}
Adw ${getGIRepositoryVersion(Adw)}
GTK ${getGIRepositoryVersion(Gtk)}
GLib ${getGLibVersion()}
WebKit2 ${getGIRepositoryVersion(WebKit)}
`.trim();

  const dialog = new Adw.AboutWindow({
    application,
    application_name: "Playhouse",
    developer_name: "Sonny Piers",
    copyright: "Copyright 2022 Sonny Piers",
    license_type: Gtk.License.GPL_3_0_ONLY,
    version: pkg.version,
    transient_for: application.get_active_window(),
    modal: true,
    website: "https://playhouse.sonny.re",
    application_icon: pkg.name,
    issue_url: "https://github.com/sonnyp/Playhouse/issues",
    // TRANSLATORS: eg. 'Translator Name <your.email@domain.com>' or 'Translator Name https://website.example'
    translator_credits: _("translator-credits"),
    debug_info,
    developers: ["Sonny Piers https://sonny.re"],
    artists: [
      "Jakub Steiner https://jimmac.eu",
      "Tobias Bernard <tbernard@gnome.org>",
    ],
  });
  // dialog.add_credit_section("Contributors", [
  //   // Add yourself as
  //   // "John Doe",
  //   // or
  //   // "John Doe <john@example.com>",
  //   // or
  //   // "John Doe https://john.com",
  // ]);
  dialog.present();

  return { dialog };
}
