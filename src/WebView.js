export default function WebView({ web_view }) {
  const settings = web_view.get_settings();
  settings.set_enable_developer_extras(true);
}
