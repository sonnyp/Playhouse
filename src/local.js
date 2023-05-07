#!/usr/bin/env -S gjs -m

import { exit, programArgs, programInvocationName } from "system";
import GLib from "gi://GLib";
import { setConsoleLogDomain } from "console";
import Gio from "gi://Gio";

import { build as gjspack } from "../troll/gjspack/src/gjspack.js";

imports.package.init({
  name: "re.sonny.Playhouse",
  version: "dev",
  prefix: "/tmp/Playhouse",
  libdir: "/tmp/Playhouse",
  datadir: "/tmp/Playhouse",
});
setConsoleLogDomain("re.sonny.Playhouse");
GLib.set_application_name("Playhouse");

globalThis.__DEV__ = true;

const project_root = Gio.File.new_for_uri(
  import.meta.url,
).resolve_relative_path("../..");
const { gresource_path, prefix } = gjspack({
  appid: "re.sonny.Playhouse",
  prefix: "/re/sonny/Playhouse",
  project_root,
  resource_root: project_root.resolve_relative_path("./src"),
  entry: project_root.resolve_relative_path("./src/main.js"),
  output: project_root.resolve_relative_path("./src"),
  potfiles: project_root.resolve_relative_path("./po/POTFILES"),
});
const resource = Gio.resource_load(gresource_path);
Gio.resources_register(resource);

const { main } = await import(`resource://${prefix}/main.js`);

const exit_code = await main([programInvocationName, ...programArgs]);
exit(exit_code);
