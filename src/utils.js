import Gio from "gi://Gio";
import Source from "gi://GtkSource";
import GLib from "gi://GLib";

import { promiseTask } from "../troll/src/util.js";

const language_manager = Source.LanguageManager.get_default();

export const settings = new Gio.Settings({
  schema_id: pkg.name,
  path: "/re/sonny/Playhouse/",
});

export function createDataDir() {
  const data_dir = GLib.build_filenamev([GLib.get_user_data_dir(), pkg.name]);

  try {
    Gio.File.new_for_path(data_dir).make_directory(null);
  } catch (err) {
    if (err.code !== Gio.IOErrorEnum.EXISTS) {
      throw err;
    }
  }

  return data_dir;
}

export function prepareSourceView(
  source_view,
  { ext, lang, data_dir, placeholder },
) {
  const { buffer } = source_view;

  buffer.set_language(language_manager.get_language(lang));

  const file = Gio.File.new_for_path(
    GLib.build_filenamev([data_dir, `state.${ext}`]),
  );

  const source_file = new Source.File({
    location: file,
  });

  loadSourceBuffer({ file: source_file, buffer })
    .then((success) => {
      if (!success) replaceBufferText(buffer, placeholder, true);
    })
    .catch(logError);

  function save() {
    saveSourceBuffer({ file: source_file, buffer }).catch(logError);
  }

  buffer.connect("modified-changed", () => {
    if (!buffer.get_modified()) return;
    save();
  });
}

function replaceBufferText(buffer, text, scroll_start = true) {
  // this is against GtkSourceView not accounting an empty-string to empty-string change as user-edit
  if (text === "") {
    text = " ";
  }
  buffer.begin_user_action();
  buffer.delete(buffer.get_start_iter(), buffer.get_end_iter());
  buffer.insert(buffer.get_start_iter(), text, -1);
  buffer.end_user_action();
  scroll_start && buffer.place_cursor(buffer.get_start_iter());
}

async function saveSourceBuffer({ file, buffer }) {
  const file_saver = new Source.FileSaver({
    buffer,
    file,
  });
  const success = await promiseTask(
    file_saver,
    "save_async",
    "save_finish",
    GLib.PRIORITY_DEFAULT,
    null,
    null,
  );
  if (success) {
    buffer.set_modified(false);
  }
}

async function loadSourceBuffer({ file, buffer }) {
  const file_loader = new Source.FileLoader({
    buffer,
    file,
  });
  let success;
  try {
    success = await promiseTask(
      file_loader,
      "load_async",
      "load_finish",
      GLib.PRIORITY_DEFAULT,
      null,
      null,
    );
  } catch (err) {
    if (err.code !== Gio.IOErrorEnum.NOT_FOUND) {
      throw err;
    }
  }

  if (success) {
    buffer.set_modified(false);
  }
  return success;
}
