/**
 * Simple module for localization of strings.
 *
 * How to use:
 * 1. Create localization file with following JSON format:
 * {
 *   "en" :{
 *     "how": "How do you want your egg today?",
 *     "boiledEgg": "Boiled egg",
 *     "softBoiledEgg": "Soft-boiled egg",
 *     "choice": "How to choose the egg",
 *     "buyQuestion": "I'd like to buy {0} eggs, {1} dollars each."
 *   },
 *
 *   "it": {
 *     "how": "Come vuoi il tuo uovo oggi?",
 *     "boiledEgg": "Uovo sodo",
 *     "softBoiledEgg": "Uovo alla coque",
 *     "choice": "Come scegliere l'uovo",
 *     "buyQuestion": "Mi piacerebbe comprare {0} uova, {1} dollari ciascuna."
 *   }
 * }
 * 
 * 2. Use Locale's module load method, specifying path to your localization file and set chosen language, e.g.:
 *    > Locale.load('static/locale/locale.json');
 *    > Locale.setLanguage('en');
 * 
 * 3. Use localization strings:
 *    > console.log(Locale.tr.how);
 *    How do you want your egg today?
 *    > console.log(Locale.tr.boiledEgg);
 *    Boiled egg
 * 
 * 4. String formatting
 *    > console.log(Locale.tr.buyQuestion.format(10, 0.5));
 *    I'd like to buy 10 eggs, 0.5 dollars each.
 */

export class Locale {
    /**
     * Loads translation object from external json file.
     *  
     * @param {String} path Path to resource.
     * @return {Promise}
     */
    static async load(path) {
        if (!this.__enabled) {
            Promise.resolve()
        }

        await fetch(path)
        .then((resp) => resp.json())
        .then((resp) => {
            this.loadFromObject(resp);
        });
    }

    /**
     * Sets language used by module.
     *
     * @param {String} lang 
     */
    static setLanguage(lang) {
        this.__enabled = true;
        this.language = lang;
    }

    /**
     * Returns reference to translation object for current language.
     *
     * @return {Object}
     */
    static get tr() {
        return this.__trObj[this.language];
    }

    /**
     * Loads translation object from existing object (binds existing object).
     *
     * @param {Object} trObj 
     */
    static loadFromObject(trObj) {
        this.__trObj = trObj;
        for (const lang of Object.values(this.__trObj)) {
            for (const str of Object.keys(lang)) {
                lang[str] = new LocalizedString(lang[str]);
            }
        }
    }
}

Locale.__enabled = false;

/**
 * Extended string class used for localization.
 */
class LocalizedString extends String {
    /**
     * Returns formatted LocalizedString.
     * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
     * 
     * E.g.:
     * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
     * A and B and A
     *
     * @param  {...any} args List of arguments for placeholders.
     */
    format(...args) {
        let sub = this;
        args.forEach((arg, index) => {
            sub = sub.split(`{${index}}`).join(arg);
        });
        return new LocalizedString(sub);
    }
}