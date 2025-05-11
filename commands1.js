// commands.js

/**
 * Command implementations that can be dynamically invoked by name.
 */
export const commands = {
    mymy: {
        t1() { 
            //this is t1
            console.log('t1') 
        },
    },
    test() {
        console.log("HELLO TEST FROM COMMANDS");
        return "test_ok";
    },

    /**
     * Encodes a string into Base64 format.
     * @param {string} input
     * @returns {string}
     */
    encode(input = '') {
        try {
            return `ENCODED: ${btoa(input)}`;
        } catch (e) {
            return `ERROR: Unable to encode input.`;
        }
    },

    /**
     * Creates a simple hash-like output (not cryptographic).
     * @param {string} input
     * @returns {string}
     */
    hash(input = '') {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return `HASHED: ${Math.abs(hash)}`;
    }
};
