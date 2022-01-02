import Gio from "gi://Gio";

export default function Devtools({ web_view, devtools, window }) {
  const inspector = web_view.get_inspector();
  inspector.show();

  function enableInspector() {
    if (devtools.get_child()) {
      return onShowDevtools();
    }
    const inspector_web_view = inspector.get_web_view();
    if (!inspector_web_view) return false;
    inspector_web_view.hexpand = true;
    devtools.set_child(inspector_web_view);
    return true;
  }

  ["attach", "bring-to-front", "detach", "open-window", "closed"].forEach(
    (event) => {
      inspector.connect(event, () => {
        console.log(event);
      });
    },
  );

  inspector.connect("attach", enableInspector);
  inspector.connect("open-window", enableInspector);

  function onShowDevtools() {
    devtools.set_reveal_child(true);
    return true;
  }

  function toggleDevtools() {
    devtools.set_reveal_child(!devtools.reveal_child);
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
