import Gio from "gi://Gio";
import GObject from "gi://GObject";
import GLib from "gi://GLib";

import { settings } from "./utils.js";

export default function Devtools({ window, builder }) {
  const webview_devtools = builder.get_object("webview_devtools");

  const WEBKIT_INSPECTOR_HTTP_SERVER = GLib.getenv(
    "WEBKIT_INSPECTOR_HTTP_SERVER",
  );
  const [hostname, port] = WEBKIT_INSPECTOR_HTTP_SERVER.split(":");
  webview_devtools.load_uri(
    `http://${hostname}:${port}/Main.html?ws=${hostname}:${port}/socket/1/2/WebPage`,
  );

  const button_devtools = builder.get_object("button_devtools");
  settings.bind(
    "show-devtools",
    button_devtools,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );

  const devtools = builder.get_object("devtools");
  button_devtools.bind_property(
    "active",
    devtools,
    "visible",
    GObject.BindingFlags.SYNC_CREATE,
  );

  const paned = builder.get_object("paned");
  // For some reasons those don't work
  // as builder properties
  paned.set_shrink_start_child(false);
  paned.set_shrink_end_child(false);
  paned.set_resize_start_child(true);
  paned.set_resize_end_child(true);

  function toggleDevtools() {
    const visible = !devtools.visible;
    devtools.set_visible(visible);
  }

  const inspector_action = new Gio.SimpleAction({
    name: "inspector",
    parameter_type: null,
  });
  inspector_action.connect("activate", toggleDevtools);
  window.add_action(inspector_action);
}
