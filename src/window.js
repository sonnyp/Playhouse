import Gtk from "gi://Gtk";
// import Gdk from "gi://Gdk";
import GObject from "gi://GObject";
import Gio from "gi://Gio";
import WebKit from "gi://WebKit2?version=5.0";
import Source from "gi://GtkSource?version=5";
import Adw from 'gi://Adw?version=1'

import { relativePath } from "./util.js";
import Shortcuts from "./Shortcuts.js";
import Devtools from "./Devtools.js";
import WebView from "./WebView.js";

const settings = new Gio.Settings({
  schema_id: "re.sonny.Playhouse",
  path: "/re/sonny/Playhouse/",
});

Source.init();

const scheme_manager = Source.StyleSchemeManager.get_default()
const language_manager = Source.LanguageManager.get_default();
const style_manager = Adw.StyleManager.get_default();

export default function Window({ application }) {
  // Solves
  // Invalid object type 'WebKitWebView'
  // Invalid object type 'GtkSourceView'
  // see https://stackoverflow.com/a/60128243
  new WebKit.WebView();

  const builder = Gtk.Builder.new_from_file(relativePath("./window.ui"));

  const window = builder.get_object("window");
  if (__DEV__) window.add_css_class("devel");
  window.set_application(application);

  // const source_view = builder.get_object("source_view");
  // const source_buffer = builder.get_object("source_buffer");
  const web_view = builder.get_object("web_view");
  WebView({ web_view });

  const source_view_html = builder.get_object("source_view_html");
  source_view_html.buffer.set_language(language_manager.get_language("html"));
  source_view_html.buffer.set_text(`
<div>
  <p>Playhouse!</p>
</div>
`.trim(), -1);

  const source_view_css = builder.get_object("source_view_css");
  source_view_css.buffer.set_language(language_manager.get_language("css"));
  source_view_css.buffer.set_text(`
html {
  font-family: sans-serif;
  width: 100%;
  height: 100%;
}

body {
  background-color: white;
  color: #363636;
  width: 100%;
  height: 100%;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #363636;
    color: white;
  }
}

div {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

p {
  text-align: center;
  font-size: 3em;
  font-family: sans-serif;
  letter-spacing: 0.1em;
  transition: 0.8s;
  text-transform: uppercase;
  text-shadow: 1px 1px 0 grey, 1px 2px 0 grey, 1px 3px 0 grey, 1px 4px 0 grey,
    1px 5px 0 grey, 1px 6px 0 grey, 1px 7px 0 grey, 1px 8px 0 grey,
    5px 13px 15px black;
}

p:hover {
   transform: rotate(360deg);
}`.trim(), -1)

  const source_view_javascript = builder.get_object("source_view_javascript");
  source_view_javascript.buffer.set_language(
    language_manager.get_language("js"),
  );
  source_view_javascript.buffer.set_text(`
  console.log('Welcome to Playhouse!')
  `, -1)



  const devtools = builder.get_object("devtools");
  Devtools({ web_view, devtools, window });

  const button_html = builder.get_object("button_html");
  const button_css = builder.get_object("button_css");
  const button_javascript = builder.get_object("button_javascript");
  const button_output = builder.get_object("button_output");
  const button_devtools = builder.get_object("button_devtools");
  const button_style_mode = builder.get_object("button_style_mode")

  const source_views = [source_view_html, source_view_css, source_view_javascript]

  function updateStyle() {
    const {dark} = style_manager;
    const scheme = scheme_manager.get_scheme(dark ? "Adwaita-dark" : "Adwaita");
    source_views.forEach(({buffer}) => {
      buffer.set_style_scheme(scheme)
    });

    if (dark) {
      button_style_mode.icon_name = 'weather-clear-symbolic'
    } else {
      button_style_mode.icon_name = 'weather-clear-night-symbolic'
    }
  }
  updateStyle()
  style_manager.connect('notify::dark', updateStyle)

  button_style_mode.connect(
    "clicked", () => {
      settings.set_boolean('toggle-color-scheme', !settings.get_boolean('toggle-color-scheme'));
    }
  )

  function setColorScheme() {
    const toggle_color_scheme = settings.get_boolean('toggle-color-scheme');
    if (toggle_color_scheme) {
      style_manager.set_color_scheme(style_manager.dark ? Adw.ColorScheme.FORCE_LIGHT : Adw.ColorScheme.FORCE_DARK)
    } else {
      style_manager.set_color_scheme(Adw.ColorScheme.DEFAULT)
    }
  }
  setColorScheme()
  settings.connect('changed', setColorScheme)

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
