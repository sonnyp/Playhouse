import Gio from "gi://Gio";

export const settings = new Gio.Settings({
  schema_id: pkg.name,
  path: "/re/sonny/Playhouse/",
});
