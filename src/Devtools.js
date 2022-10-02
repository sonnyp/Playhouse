import Gio from "gi://Gio";
import GObject from "gi://GObject";

import { settings } from "./utils.js";

export default function Devtools({ web_view, window, builder }) {
  const inspector = web_view.get_inspector();
  inspector.show();

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

  function enableInspector() {
    const [widget] = [...devtools];
    if (widget) {
      return onShowDevtools();
    }
    const inspector_web_view = inspector.get_web_view();
    if (!inspector_web_view) return false;
    inspector_web_view.hexpand = true;
    devtools.append(inspector_web_view);
    return true;
  }

  // ["attach", "bring-to-front", "detach", "open-window", "closed"].forEach(
  //   (event) => {
  //     inspector.connect(event, () => {
  //       console.log(event);
  //     });
  //   },
  // );

  inspector.connect("attach", enableInspector);
  inspector.connect("open-window", enableInspector);

  function onShowDevtools() {
    devtools.set_visible(true);
    return true;
  }

  function toggleDevtools() {
    devtools.set_visible(!devtools.visible);
  }

  // The devtools don't work after "closed"
  // hopefull there is an API to remove the close / position buttons that appear
  // when the window is maximized
  // function onHideDevtools() {
  //   devtools.set_reveal_child(false);
  //   return true;
  // }
  // inspector.connect("detach", onHideDevtools);
  // inspector.connect("closed", onClosed);

  const inspector_action = new Gio.SimpleAction({
    name: "inspector",
    parameter_type: null,
  });
  inspector_action.connect("activate", toggleDevtools);
  window.add_action(inspector_action);
}
