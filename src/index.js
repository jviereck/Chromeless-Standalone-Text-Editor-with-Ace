const ui = require("ui");
const menu = require("menu");

var editor = null;
var editorSession = null;
var currentFile = null;

window.onload = function() {
    var JavaScriptMode = reqace("ace/mode/javascript").Mode;

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editorSession = editor.getSession();
    editorSession.setMode(new JavaScriptMode());
};

// http://groups.google.com/group/ace-discuss/msg/3d10daf9bd019b3d
saveFile = function () {
    var data = editorSession.getValue();
    require("file").writeAsync(currentFile, data, true, function(err) {
        if (err) {
            console.log("Error while writing file", err);
            alert("Can't save file.")
        } else {
            console.log("File written to output async!");
        }
    });
}

openFile = function () {
    const filePicker = require('file-picker');
    var fp = filePicker.FilePicker();
    // Set the dialog title and selection mode
    fp.title = "Hi!  Pick some files!"
    fp.mode = "multiple";
    fp.show(function(x) {
        // Check if the user selected nothing.
        if (!x) {
            return;
        }
        console.log("you picked " + x.length + " files");
        currentFile = "" + x[0];
        require("file").readAsync(currentFile, function(err, data) {
            if (err) {
                console.log("Error while reading file", currentFile, ":", err);
                alert("Can't open file.");
                return;
            }
            editorSession.setValue(data);
        });
    });
}

var file = menu.Menu({
    parent: ui.getMenu(),
    label: "File",
    children: [
    menu.Menu({
        label: "Open File",
        hotkey: "accel-o",
        onClick: function(e) {
            openFile();
        }
        }),
        menu.Menu({
            label: "Save",
            hotkey: "accel-s",
            onClick: function (e) {
                saveFile();
            }
        })
    ]
});
