export default function WebView({ webview }) {
  const settings = webview.get_settings();
  settings.set_enable_developer_extras(true);
}
