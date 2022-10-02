desktop_file = i18n.merge_file(
  input: 're.sonny.Playhouse.desktop',
  output: 're.sonny.Playhouse.desktop',
  type: 'desktop',
  po_dir: '../po',
  install: true,
  install_dir: join_paths(get_option('datadir'), 'applications')
)

desktop_utils = find_program('desktop-file-validate', required: false)
if desktop_utils.found()
  test('Validate desktop file', desktop_utils,
    args: [desktop_file]
  )
endif

service_conf = configuration_data()
service_conf.set('bindir', bindir)
configure_file(
  input: 're.sonny.Playhouse.service',
  output: 're.sonny.Playhouse.service',
  configuration: service_conf,
  install_dir: join_paths(get_option('datadir'), 'dbus-1/services')
)

appstream_file = i18n.merge_file(
  input: 're.sonny.Playhouse.metainfo.xml',
  output: 're.sonny.Playhouse.metainfo.xml',
  po_dir: '../po',
  install: true,
  install_dir: join_paths(get_option('datadir'), 'metainfo')
)

appstream_cli = find_program('appstreamcli', required: false)
if appstream_cli.found()
  test('Validate metainfo file', appstream_cli,
    args: ['validate', '--override=release-time-missing=info', '--no-net', appstream_file]
  )
endif

appstream_util = find_program('appstream-util', required: false)
if appstream_util.found()
  test('Validate appstream file', appstream_util,
    args: ['validate', appstream_file]
  )
endif

install_data('re.sonny.Playhouse.gschema.xml',
  install_dir: join_paths(get_option('datadir'), 'glib-2.0/schemas')
)

compile_schemas = find_program('glib-compile-schemas', required: false)
if compile_schemas.found()
  test('Validate schema file', compile_schemas,
    args: ['--strict', '--dry-run', meson.current_source_dir()]
  )
endif

install_subdir('icons/hicolor', install_dir : join_paths(get_option('datadir'), 'icons'))
