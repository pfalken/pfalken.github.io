import { keyStore } from "/core/store.js";

export const mem = {
    commands: {},
    history: await keyStore.loadCommandsHistory([]),
    historyIndex: (await keyStore.loadCommandsHistory([])).length
};

export async function runCommand(input) {
    console.log(cmd);
    //console.log(mem.history);
    addInputToHistory(input);
    var cmd = {
        content: "",
        command: "",
        params: "",
        found: true
    };
    cmd.command = input.split(" ", 1)[0];
    if (input.indexOf(" ") > 0)
        cmd.params = input.substring(input.indexOf(" ") + 1).trim();
    //console.log(cmd);
    //console.log(typeof mem.commands[cmd.command] === 'function');
    //console.log(cmd.command in mem.commands);

    if (cmd.command === "help") {
        cmd.content = await showHelp(mem.commands);
    } else if (cmd.command in mem.commands && typeof mem.commands[cmd.command] === 'function') {
        cmd.content = await mem.commands[cmd.command](cmd.params);
    } else {
        cmd.found = false;
    }
    return cmd;
}

export async function importDefaultCommands() {
    var commandsDefault = (await import('/modules/consola.js')).commands;
    mem.commands = Object.assign({}, commandsDefault)
    importCommandsFromUrl('/commands1.js');
    importCommandsFromUrl('/commands2.js');
    importCommandsFromUrl('/modules/btc.js');
    importCommandsFromUrl('/modules/disk.js');
    //console.log(mem.commands);
}
export async function importCommandsFromUrl(url) {
    var commandsFromUrl = (await import(url)).commands;
    for (const key in commandsFromUrl) {
        if (commandsFromUrl.hasOwnProperty(key)) {
            mem.commands[key] = commandsFromUrl[key];
        }
    }
}

async function addInputToHistory(input) {
    if (input.trim() && input !== mem.history[mem.history.length - 1]) {
        mem.history.push(input);
    }
    const maxHistoryLength = 50;
    if (mem.history.length > maxHistoryLength)
        mem.history = mem.history.slice(mem.history.length - maxHistoryLength);
    mem.historyIndex = mem.history.length;
    keyStore.saveCommandsHistory(mem.history);
    //await keyStore.saveBtcWalletSeedAsync('11111');
    //console.log('seed', await keyStore.loadBtcWalletSeedAsync("EMPTY"));
}

async function showHelp(commandsObj) {
    let multiLine = '';
    console.log(commandsObj['test']);
    const cmds = Object.keys(commandsObj).sort();
    console.log(cmds);
    //console.log(cmds.length);
    for (let index = 0; index < cmds.length; index++) {
        const cmdName = cmds[index];
        console.log(cmdName);
        //const desc = extractLeadingComments(commandsObj[cmdName]).toString();
        multiLine += `${cmdName}\n`;
    }
    console.log(multiLine);
    return multiLine;
}
function extractLeadingComments(fnOrSource) {
    // Get the source code as a string
    const src = typeof fnOrSource === 'function'
        ? fnOrSource.toString()
        : fnOrSource;

    // Strip away everything before the opening "{"
    const bodyStart = src.indexOf('{') + 1;
    // Strip away everything after the matching closing "}"
    // (naive: last "}", but works for simple single-function strings)
    const bodyEnd = src.lastIndexOf('}');
    const body = src.slice(bodyStart, bodyEnd);

    const lines = body.split(/\r?\n/);
    const comments = [];

    for (let line of lines) {
        const t = line.trim();
        if (t.startsWith('//')) {
            // single-line comment
            comments.push(t.slice(2).trim());
        }
        else if (t.startsWith('/*')) {
            // collect a /* ... */ block
            let block = t;
            // if not closed on same line, continue collecting
            if (!t.includes('*/')) {
                let i = lines.indexOf(line) + 1;
                while (i < lines.length && !lines[i].includes('*/')) {
                    block += '\n' + lines[i].trim();
                    i++;
                }
                if (i < lines.length) {
                    block += '\n' + lines[i].trim();
                }
            }
            // strip the /* and */ markers
            const stripped = block
                .replace(/^\/\*/, '')
                .replace(/\*\/$/, '')
                .trim();
            comments.push(stripped);
        }
        else if (t === '') {
            // skip blank lines at top
            continue;
        }
        else {
            // first non-comment, non-blank line → stop
            break;
        }
    }

    return comments;
}
