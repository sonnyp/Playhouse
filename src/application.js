import Gio from "gi://Gio";
import Adw from "gi://Adw";
import GLib from "gi://GLib";

import Window from "./window.js";
import About from "./about.js";
import ShortcutsWindow from "./ShortcutsWindow.js";

import { settings } from "./utils.js";

import "./style.css";

export default function Application() {
  const application = new Adw.Application({
    application_id: "re.sonny.Playhouse",
    // flags: Gio.ApplicationFlags.HANDLES_OPEN,
  });

  application.connect("activate", () => {
    Window({
      application,
    });
  });

  application.connect("handle-local-options", (self, options) => {
    return options.contains("terminate_after_init") ? 0 : -1;
  });

  // This shouldn't be in the main options but rather in a "Development" group
  // unfortunally - I couldn't use OptionGroup
  // https://gitlab.gnome.org/GNOME/gjs/-/issues/448
  application.add_main_option(
    "terminate_after_init",
    null,
    GLib.OptionFlags.NONE,
    GLib.OptionArg.NONE,
    "Exit after initialization complete",
    null,
  );

  application.set_option_context_description("<https://playhouse.sonny.re>");
  application.set_option_context_parameter_string("[URI…]");
  // TODO: Add examples
  // application.set_option_context_summary("");

  const quit = new Gio.SimpleAction({
    name: "quit",
    parameter_type: null,
  });
  quit.connect("activate", () => {
    application.quit();
  });
  application.add_action(quit);

  const showAboutDialog = new Gio.SimpleAction({
    name: "about",
    parameter_type: null,
  });
  showAboutDialog.connect("activate", () => {
    About({ application });
  });
  application.add_action(showAboutDialog);

  const showShortCutsWindow = new Gio.SimpleAction({
    name: "shortcuts",
    parameter_type: null,
  });
  showShortCutsWindow.connect("activate", () => {
    ShortcutsWindow({ application });
  });
  application.add_action(showShortCutsWindow);

  application.add_action(settings.create_action("color-scheme"));

  return application;
}

const style_manager = Adw.StyleManager.get_default();
function setColorScheme() {
  const color_scheme = settings.get_int("color-scheme");
  style_manager.set_color_scheme(color_scheme);
}
setColorScheme();
settings.connect("changed::color-scheme", setColorScheme);
