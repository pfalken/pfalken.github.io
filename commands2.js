// commands2.js
import * as helper from './commands2_helper.js';   // ⬅︎ private to this module


export const commands = {
  draw1() {
    //Calls helper.commands.drawMe() and returns the ASCII art.
    //line 2 of comments
    return helper.commands.drawMe();
  },
  draw2() {
    return helper.commands.drawIt();
  },

  /**
   * Draws ASCII art A.
   */
  drawA() {
    return `
        +----+
        | A  |
        +----+
      `;
  },
  /**
   * Draws ASCII art B.
   */
  drawB() {
    return `
        #####
        # B #
        #####
      `;
  },

};
