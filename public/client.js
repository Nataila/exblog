require('./plugins/bootstrap/css/bootstrap.css');
require('./stylesheets/login.sass');

let testEditor;
$(() => {
  testEditor = editormd("content-editormd", {
    width: "100%",
    height: 640,
    syncScrolling: "single",
    path: "../plugins/editor.md/js/lib/"
  });
});
