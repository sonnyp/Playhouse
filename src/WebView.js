export default function WebView({ web_view }) {
  const settings = web_view.get_settings();
  settings.set_enable_developer_extras(true);

  const user_content_manager = web_view.get_user_content_manager();

  user_content_manager.connect("script-message-received::foobar", () => {
    console.log("foo");
  });

  user_content_manager.register_script_message_handler("foobar", null);
}
