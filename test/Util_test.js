const path = require("path");
const {traverse} = require("./../src/Util");

describe("Util", () => {
    it("traverse should err for invalid dir", () => {
        const dirPath = "";
        expect(() => {
            traverse(dirPath, ".js");
        }).toThrowError("ENOENT: no such file or directory, scandir");
    });

    it("traverse should err for file", () => {
        const dirPath = path.join(__dirname, "./../src/Util.js");
        expect(() => {
            traverse(dirPath, ".js");
        }).toThrowError("ENOTDIR: not a directory, scandir '/home/cts1/ws/cytorus/src/Util.js'");
    });

    it("traverse should filter files not matching with given extention", () => {
        const dirPath = path.join(__dirname, "./../E2E/cypress/integration/features");
        const output = traverse(dirPath, ".js");
        expect(output).toEqual([]);
    });

    it("traverse should work with nested directories", () => {
        const dirPath = path.join(__dirname, "./../E2E/cypress/integration/features");
        const output = traverse(dirPath, ".feature");
        expect(output.length).toEqual(10);
    });

});