import fs from "fs";
import InputEvent from 'input-event';

// Notice that you must run as root or otherwise have access to the dev input files.

export default function(handler) {
    // Linux key mapping to browser keycodes (see tools/genkbmapping.html).
    // US kb.
    var mappings = [0,27,49,50,51,52,53,54,55,56,57,48,189,187,8,9,81,87,69,82,84,89,85,73,79,80,219,221,13,17,65,83,68,70,71,72,74,75,76,186,222,192,16,220,90,88,67,86,66,78,77,188,190,191,16,106,18,32,20,112,113,114,115,116,117,118,119,120,121,144,145,103,104,105,109,100,101,102,107,97,98,99,96,110,-1,-1,-1,122,123,-1,-1,-1,-1,-1,-1,-1,13,17,-1,-1,225,-1,36,38,33,37,39,35,40,34,45,46];

    var shift = false;

    var handleKey = function(data) {
        if (data.code == 42 || data.code == 54) {
            shift = true;
        }

        var kc = mappings[data.code];
        if (kc > 0) {
            // Convert to char code.
            var char = String.fromCharCode(kc);
            var charCode = null;
            if (char) {
                char = char.toLowerCase();
                if (shift) {
                    char = char.toUpperCase();
                }
                charCode = char.charCodeAt(0);
            }


            var obj = {keyCode: kc, charCode: charCode, preventDefault: function() {}};
            handler(obj);
        }
    };

    var handleKeyUp = function(data) {
        if (data.code == 42 || data.code == 54) {
            shift = false;
        }
    };

// Auto-detect the keyboard inputs.
    var getKeyboardEvents = function() {

        var files = [];
        if (fs.existsSync("/dev/input")) {
            files = fs.readdirSync("/dev/input");
            files = files.filter(function(item) {return item.indexOf("event") === 0});
            files = files.map(function(item) {return "/dev/input/" + item;});
            if (files.length > 4) {
                if (fs.existsSync("/dev/input/by-id")) {
                    files = fs.readdirSync("/dev/input/by-id");
                    files = files.filter(function(item) {return item.indexOf("kbd") !== -1});
                    files = files.map(function(item) {return "/dev/input/by-id/" + item;});
                }
            }
        }
        return files;
    };

    var kbEventFiles = getKeyboardEvents();
    console.log('event files', kbEventFiles);

    kbEventFiles.forEach(function(kbEventFile) {
        var keyboard = new InputEvent.Keyboard(kbEventFile);
        keyboard.on('keydown', handleKey);
        keyboard.on('keypress', handleKey);
        keyboard.on('keyup', handleKeyUp);
    });

};

