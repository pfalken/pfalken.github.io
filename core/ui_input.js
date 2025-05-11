import * as dr from "./display.js";
import * as cmds from "./commands_manager.js";

const consoleDiv = dr.consoleDiv;

export const mem = {
    inputLine: {},
    cursor: {},
    buffer: ''
};

document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'c')) {
        return; // allow paste, copy
    }

    if (event.key === 'Backspace') {
        mem.buffer = mem.buffer.slice(0, -1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        if (cmds.mem.history.length > 0) {
            cmds.mem.historyIndex = Math.max(0, cmds.mem.historyIndex - 1);
            console.log(cmds.mem.historyIndex);
            mem.buffer = cmds.mem.history[cmds.mem.historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();
        if (cmds.mem.history.length > 0) {
            cmds.mem.historyIndex = Math.min(cmds.mem.history.length - 1, cmds.mem.historyIndex + 1);
            console.log(dr.mem.historyIndex);
            mem.buffer = cmds.mem.history[cmds.mem.historyIndex];
        }
    } else if (event.key === 'Tab') {
        event.preventDefault();
        event.stopPropagation();
        return;
    } else if (event.key === 'Enter') {
        const handleLineInputAsync = async () => {
            consoleDiv.removeChild(mem.cursor);
            mem.inputLine.textContent = mem.buffer;
            
            const commandResposne = await cmds.runCommand(mem.buffer);
            
            if (commandResposne.found && commandResposne.content) {
                console.log(commandResposne);
                await dr.creatResponseLine(commandResposne.content);
            } else if(!commandResposne.found) {
                await dr.creatResponseLine(`\ncommand not found: ${commandResposne.command}`);
            }

            mem.buffer = '';
            const line = dr.createInputLine();
            mem.inputLine = line.inputLine;
            mem.cursor = line.cursor;
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
            return;
        }
        handleLineInputAsync();
    } else if (event.key.length === 1) {
        mem.buffer += event.key;
    }
    mem.inputLine.textContent = mem.buffer;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
});

document.addEventListener('paste', async (event) => {
    if (!mem.inputLine || !mem.cursor) return;
    const pasteText = (event.clipboardData || window.clipboardData).getData('text');
    mem.buffer += pasteText;
    mem.inputLine.textContent = mem.buffer;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // // Simulate pressing Enter
    // const enterEvent = new KeyboardEvent('keydown', {
    //     key: 'Enter'
    // });
    // document.dispatchEvent(enterEvent);
});