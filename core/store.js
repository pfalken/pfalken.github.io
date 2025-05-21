
export const keyStore = {
    async saveCommandsHistory(value) {
        await this.save('commands_history', value);
    },
    async loadCommandsHistory(defaultValue = null) {
        return await this.load('commands_history', defaultValue);
    },
    async saveBtcWalletSeedAsync(value) {
        await this.saveSecure('btc_wallet_seed', value);
    },
    async loadBtcWalletSeedAsync(defaultValue = null) {
        return await this.loadSecure('btc_wallet_seed', defaultValue);
    },

    async save(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (err) {
            console.error(`Error saving to localStorage [${key}]:`, err);
        }
    },
    async load(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (err) {
            console.error(`Error loading from localStorage [${key}]:`, err);
            return defaultValue;
        }
    },
    async saveSecure(key, value) {
        var sec = new SecureDbKv();
        await sec.save(key, value);
    },
    async loadSecure(key, defaultValue = null) {
        var sec = new SecureDbKv();
        return await sec.load(key, defaultValue);
    }

};

class SecureDbKv {
    #data;
    constructor() {
        this.#data = new IndexDb('securedb', 'keyvalues');
    }
    async save(key, value) {
        await this.#data.saveToIndexedDB(key, value);
    }
    async load(key, defaultValue = null) {
        return await this.#data.loadFromIndexedDB(key, defaultValue);
    }
}

class IndexDb {
    #dbName;
    #storeName = "";
    constructor(dbName, storeName) {
        this.#dbName = dbName;
        this.#storeName = storeName;
    }

    async saveToIndexedDB(key, value) {
        const db = await this.#openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.#storeName], 'readwrite');
            const store = transaction.objectStore(this.#storeName);
            const request = store.put(value, key);

            request.onsuccess = function () {
                resolve(`Saved key "${key}" successfully.`);
            };

            request.onerror = function (event) {
                reject(`Save error: ${event.target.errorCode}`);
            };
        });
    }

    async loadFromIndexedDB(key, defaultValue = null) {
        const db = await this.#openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.#storeName], 'readonly');
            const store = transaction.objectStore(this.#storeName);
            const request = store.get(key);

            request.onsuccess = function () {
                if (!request.result)
                    resolve(defaultValue);
                resolve(request.result);
            };

            request.onerror = function (event) {
                reject(`Load error: ${event.target.errorCode}`);
            };
        });
    }

    #openDatabase() {
        const dbName = this.#dbName;
        const storeName = this.#storeName;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject(`Database error: ${event.target.errorCode}`);
            };
        });
    }
}
