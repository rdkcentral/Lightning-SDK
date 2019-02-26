export default class App extends lng.Component {

    static g(c) {
        return c.seekAncestorByType(this);
    }

    /**
     * Returns all fonts to be preloaded before entering this app.
     * @returns {{family: string, url: string, descriptors: {}}[]}
     */
    static getFonts() {
        return [];
    }

    get identifier() {
        const identifier = this.constructor.identifier;
        if (!identifier) throw new Error("Application does not have an identifier: " + this.constructor.name);
        return identifier;
    }

    getPath(relPath) {
        return App.getPath(this.constructor, relPath);
    }

    static getPath(relPath) {
        return "static/" + relPath;
    }

    static get identifier() {
        throw new Error("Please supply an identifier in the App definition file.");
    }

}