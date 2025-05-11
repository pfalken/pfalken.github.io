import * as cons from "/modules/consola.js";

export const commands = {
    async btc(args) {
        console.log("args", args);
        if (!args)
            return "args missing. add action like; waller or mine";
        let [name, ...rest] = args.trim().split(/\s+/);
        let params = rest.join(" ");

        let fn = this[name];
        if (typeof fn !== "function") {
            const action = rest[0];
            params = rest.slice(1);
            fn = this[`${name}_${action}`];
        }
        console.log(params);
        console.log(fn);
        if (typeof fn !== "function") {
            return `Unknown action "${name}"`;
        }

        // call it, binding the same `this` and passing params if any:
        return await fn.call(this, params);
    },

    async wallet_create(args) {
        cons.commands.print("todo.1.." + args);
        
    },
    async wallet_list() {
        cons.commands.print("todo..");
    },
    async wallet_remove(id) {
        cons.commands.print("todo..");
    }



};
