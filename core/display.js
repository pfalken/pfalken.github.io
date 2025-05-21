export const consoleDiv = document.getElementById('console');
export const mem = {
    
};



export function createInputLine() {
    const lineBreak = document.createElement('br');
    const prompt = document.createTextNode('> ');
    const inputLine = document.createElement('span');
    inputLine.className = 'input-line';

    const cursor = document.createElement('span');
    cursor.className = 'blinking-cursor';
    cursor.textContent = "I";

    consoleDiv.appendChild(lineBreak);
    consoleDiv.appendChild(prompt);
    consoleDiv.appendChild(inputLine);
    consoleDiv.appendChild(cursor);

    return { inputLine, cursor };
};

export async function creatResponseLine(text) {
    const lineBreak = document.createElement('br');
    const responseSpan = document.createElement('span');

    const cursor = document.createElement('span');
    cursor.textContent = "I";
    cursor.className = 'blinking-cursor';

    consoleDiv.appendChild(lineBreak);
    consoleDiv.appendChild(responseSpan);
    consoleDiv.appendChild(cursor);
    const totalDuration = 400;
    const delayDuration = text.length > 0 ? Math.round(totalDuration / text.length) + 1 : totalDuration;
    for (let i = 0; i < text.length; i++) {
        responseSpan.textContent += text[i];
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, delayDuration));
    }
    cursor.remove();
};

export function clearConsole() {
    while (consoleDiv.firstChild) {
        consoleDiv.removeChild(consoleDiv.firstChild);
    }
    consoleDiv.textContent = "WELCOME TO RETRO-TERM 1.0\nTYPE SOMETHING BELOW:\n";
};

export function changeConsoleColor(colorId) {
    //console.log(colorId);
    const names = ['green', 'jumpin jack flash', 'cmd', 'war games', 'minicomputer', 'pc', 'apple II', 'MATRIX', 'unix', 'clamshell', 'terminal', 'LOST'];
    const frcolors = ['#00FF00', '#96833E', '#C0C0C0', '#7BD7E9', '#C58022', '#B37009', '#3AB582', '#4AF6B0', '#7DC6F6', '#BDC328', '#15FAFF', '#4DF1A2'];
    const bgColors = ['black', 'black', 'black', 'black', '#3E270E', '24231F', '#151E1B', '#151E1B', '#171B1E', '#24210E', 'black', 'black'];
    const scan1Colors = ['black', 'black', 'black', 'black', '#3E270E', 'black', 'black', 'black', 'black', 'black', 'black', 'black']
    const fontWeights = ['unset', 'unset', 'unset', 'bold', 'unset', 'bold', 'unset', 'bold', 'unset', 'unset', 'bold', 'unset']
    var index = parseInt(colorId);
    if (!index || index > bgColors.length - 1) index = 0;
    document.body.style.setProperty('--console-fontw', fontWeights[index]);
    document.body.style.setProperty('--console-color', frcolors[index]);
    document.body.style.setProperty('--console-bgcolor', bgColors[index]);
    document.body.style.setProperty('--console-scanlines1', scan1Colors[index]);
}