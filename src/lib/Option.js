export default class Option {
    #config = null;
    #storage = browser.storage.local;
    #defaultConfigPath;

    constructor(defaultConfigPath = '/config.json') {
        this.#defaultConfigPath = defaultConfigPath;
        this.#startUpdateListener();
    }

    async get() {
        if (!this.#config) {
            this.#config = await this.#storage.get();

            if (!this.#config || Object.keys(this.#config).length < 1) {
                await this.reset();
            }
        }
        return structuredClone(this.#config);
    }

    async save(config) {
        await this.#storage.set(config);
        this.#config = config;
    }

    async reset() {
        const config = await (await fetch(browser.runtime.getURL(this.#defaultConfigPath))).json();

        await this.#storage.set(config);
        this.#config = config;
    }

    #startUpdateListener() {
        browser.storage.onChanged.addListener(() => this.#config = null);
    }
}