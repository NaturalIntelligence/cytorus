const {expect} = require("chai");

const rewire = require('rewire');
const PositionFilter = rewire('../src/filters/PositionFilter')
const contains = PositionFilter.__get__("contains");

describe("Position Filter", () => {
    describe("contains function", () => {
        it("should return true for positions that matched exactly to the example position", () => {
            expect(contains(["1.2", "3", "5"], 1, 2), '[1.2, 3, 5] contains 1.2').to.be.true;
        });
        it("should return true for all example positions if arr contains only scenario position", () => {
            expect(contains(["1", "3", "5"], 1, 2), '[1, 3, 5] contains 1.2').to.be.true;
        });
        it("should return false for positions that unmatched position with example", () => {
            expect(contains(["1.2", "3", "5"], 1, 1), '[1.2, 3, 5] contains 1.1').to.be.false;
        });
        it("should handle first example (0th position) correctly", () => {
            expect(contains(["1"], 1, 0), '[1] contains 1.0"').to.be.true;
            expect(contains(["1.0"], 1, 0), '[1.0] contains 1.0"').to.be.true;
            expect(contains(["1.0"], 1, 1), '[1.0] contains 1.1').to.be.false;
        });
        it("should handle example position greater than 9 correctly", () => {
            expect(contains(["1.10"], 1, 10), '[1.10] contains 1.10').to.be.true;
            expect(contains(["1.10"], 1, 1), '[1.10] contains 1.1').to.be.false;
            expect(contains(["1.11"], 1, 11), '[1.11] contains 1.11').to.be.true;
            expect(contains(["2.1"], 1, 11), '[2.1] contains 1.11').to.be.false;
        });
    });
});
