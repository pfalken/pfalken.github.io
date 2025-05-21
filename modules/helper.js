
export const Call = {
    async SubCommand(classObject, args) {
        if (!args)
            return `args missing. add sub command like: ${classObject.subCommandsMap ? classObject.subCommandsMap.join(', ') : ''}`;
        let [subCommand, ...rest] = args.trim().split(/\s+/);
        if (classObject.subCommandsMap && !classObject.subCommandsMap.includes(subCommand))
            return `Unknown sub command "${subCommand}"`;

        const action = rest[0];
        let params = rest.slice(1);
        console.log(action);
        console.log(params);


        let fnName = `${subCommand}_${action}`;
        let fn = classObject[fnName];
        if (typeof fn !== "function") {
            fn = classObject[subCommand];
            params = rest;
            if (typeof fn !== "function" && !action && classObject.subCommandsMap.includes(subCommand))
                return `${subCommand} must specify action or more args`;
        }


        if (typeof fn !== "function") {
            return `Unknown action "${action ? action : subCommand}"`;
        }

        // call it, binding the `class` and passing params if any:
        return await fn.call(classObject, params);
    }

};

export const Script = {
    async load(path) {
        console.log(`load ${path}`);
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}