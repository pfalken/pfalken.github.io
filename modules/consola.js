import * as dr from "/core/display.js";

export const commands = {
    async cls() {
        dr.clearConsole();
    },

    color(input = 0) {
        dr.changeConsoleColor(input);
    },

    crt(input = 'off') {
        dr.consoleDiv.className = input === "off" ? "" : "crt";
    },
    
    async print(input){
        await dr.creatResponseLine(input);
    }
    
};
