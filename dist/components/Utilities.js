"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
exports.shuffleArray = shuffleArray;
function unimplemented() {
    alert("This feature is unfinished but coming soon!");
}
exports.unimplemented = unimplemented;
;
//# sourceMappingURL=Utilities.js.map