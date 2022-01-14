import Gtk from "gi://Gtk";
// import Gdk from "gi://Gdk";
import GObject from "gi://GObject";
import Gio from "gi://Gio";
import WebKit from "gi://WebKit2?version=5.0";
import Source from "gi://GtkSource?version=5";

import { relativePath } from "./util.js";
import Shortcuts from "./Shortcuts.js";
import Devtools from "./Devtools.js";
import WebView from "./WebView.js";

const settings = new Gio.Settings({
  schema_id: "re.sonny.Playhouse",
  path: "/re/sonny/Playhouse/",
});

export default function Welcome({ application }) {
  // Solves
  // Invalid object type 'WebKitWebView'
  // Invalid object type 'GtkSourceView'
  // see https://stackoverflow.com/a/60128243
  new WebKit.WebView();
  new Source.View();

  const builder = Gtk.Builder.new_from_file(relativePath("./window.ui"));

  const window = builder.get_object("window");
  if (__DEV__) window.add_css_class("devel");
  window.set_application(application);

  // const source_view = builder.get_object("source_view");
  // const source_buffer = builder.get_object("source_buffer");
  const web_view = builder.get_object("web_view");
  WebView({ web_view });

  const language_manager = Source.LanguageManager.get_default();

  const source_view_html = builder.get_object("source_view_html");
  source_view_html.buffer.set_language(language_manager.get_language("html"));
  source_view_html.buffer.set_text(`<p>Playhouse!</p>`.trim(), -1);

  const source_view_css = builder.get_object("source_view_css");
  source_view_css.buffer.set_language(language_manager.get_language("css"));

  const source_view_javascript = builder.get_object("source_view_javascript");
  source_view_javascript.buffer.set_language(
    language_manager.get_language("js"),
  );

  const devtools = builder.get_object("devtools");
  Devtools({ web_view, devtools, window });

  const button_html = builder.get_object("button_html");
  const button_css = builder.get_object("button_css");
  const button_javascript = builder.get_object("button_javascript");
  const button_output = builder.get_object("button_output");
  const button_devtools = builder.get_object("button_devtools");

  settings.bind(
    "show-html",
    button_html,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "show-css",
    button_css,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "show-javascript",
    button_javascript,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "show-output",
    button_output,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );
  settings.bind(
    "show-devtools",
    button_devtools,
    "active",
    Gio.SettingsBindFlags.DEFAULT,
  );

  button_html.bind_property(
    "active",
    source_view_html.parent,
    "visible",
    GObject.BindingFlags.SYNC_CREATE,
  );

  button_css.bind_property(
    "active",
    source_view_css.parent,
    "visible",
    GObject.BindingFlags.SYNC_CREATE,
  );

  button_javascript.bind_property(
    "active",
    source_view_javascript.parent,
    "visible",
    GObject.BindingFlags.SYNC_CREATE,
  );

  button_output.bind_property(
    "active",
    web_view,
    "visible",
    GObject.BindingFlags.SYNC_CREATE,
  );

  button_devtools.bind_property(
    "active",
    devtools,
    "reveal-child",
    GObject.BindingFlags.SYNC_CREATE,
  );

  source_view_html.buffer.connect("changed", updatePreview);
  source_view_css.buffer.connect("changed", updatePreview);
  source_view_javascript.buffer.connect("changed", updatePreview);
  function updatePreview() {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Playhouse</title>
          <style>${source_view_css.buffer.text}</style>
        </head>

        <body>
          ${source_view_html.buffer.text}
        </body>

        <script type="module">${source_view_javascript.buffer.text}</script>
      </html>
    `;

    web_view.load_html(html, null);
  }
  updatePreview();

  // function updateJavaScript() {}

  // function updateCSS() {
  //   const stylesheet = new WebKit.UserStyleSheet(
  //     // JS ERROR: Error: Cannot convert string to array of 'utf8'
  //     source_view_css.buffer.text,
  //     WebKit.UserContentInjectedFrames.TOP_FRAME,
  //     WebKit.UserStyleLevel.AUTHOR,
  //     "*",
  //     null,
  //   );

  //   const content_manager = web_view.getUserContentManager();
  //   content_manager.addStyleSheet(stylesheet);
  // }

  // Use bind
  // web_view.connect("notify::title", () => {
  //   window.title = web_view.title;
  // });
  // TODO: connect favicon

  window.present();

  Shortcuts({ window, application });

  return { window };
}
