import Application from "./application.js";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

pkg.initGettext();

GLib.setenv("WEBKIT_INSPECTOR_HTTP_SERVER", "127.0.0.1:54424", false);

export function main(argv) {
  const application = Application();

  if (__DEV__) {
    const restart = new Gio.SimpleAction({
      name: "restart",
      parameter_type: null,
    });
    restart.connect("activate", () => {
      application.quit();
      GLib.spawn_async(null, argv, null, GLib.SpawnFlags.DEFAULT, null);
    });
    application.add_action(restart);
    application.set_accels_for_action("app.restart", ["<Primary><Shift>Q"]);
  }

  return application.runAsync(argv);
}
