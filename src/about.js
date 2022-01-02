import Gtk from "gi://Gtk";
import { gettext as _ } from "gettext";

export default function About({ application, datadir, version }) {
  const dialog = new Gtk.AboutDialog({
    application,
    authors: ["Sonny Piers https://sonny.re"],
    // artists: ["Tobias Bernard <tbernard@gnome.org>"],
    comments: _("A Playground for HTML/CSS/JavaScript"),
    copyright: "Copyright 2021 Sonny Piers",
    license_type: Gtk.License.GPL_3_0_ONLY,
    version,
    website: "https://webground.sonny.re",
    transient_for: application.get_active_window(),
    // Prevents input on Webground when clicking on a link
    // modal: true,
    logo_icon_name: "re.sonny.Webground",
    // TRANSLATORS: eg. 'Translator Name <your.email@domain.com>' or 'Translator Name https://website.example'
    translator_credits: _("translator-credits")
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

