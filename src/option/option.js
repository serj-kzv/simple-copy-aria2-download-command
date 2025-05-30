import Option from "../lib/Option.js";
import migrateFn from "../changelog/migrateFn.js";
import Constants from "../constants.js";

const option = new Option();
const init = async () => {
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    const optionText = document.getElementById('optionText');

    const localize = () => {
        saveButton.textContent = browser.i18n.getMessage('save');
        resetButton.textContent = browser.i18n.getMessage('reset');
        document.title = browser.i18n.getMessage('optionsTitle');
    };

    const loadOptions = async () => {
        optionText.value = JSON.stringify(await option.get(), null, "\t");
    };

    const saveOptions = () => {
        try {
            option.save(JSON.parse(optionText.value));
        } catch (e) {
            alert(`${browser.i18n.getMessage('optionsFormatError')}: ${e}`);
        }
    }

    const resetOptions = async () => {
        await option.reset();
        const config = await migrateFn(await option.get());
        config[Constants.option.extensionUuid] = crypto.randomUUID();
        await option.save(config);
        await loadOptions();
    };

    saveButton.addEventListener('click', () => saveOptions());
    resetButton.addEventListener('click', () => resetOptions());

    localize();
    await loadOptions();
};

document.addEventListener('DOMContentLoaded', () => init());
