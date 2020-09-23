const bestFit = require("./../src/cliHelper/best-fit");

describe("BestFit", () => {
    it("should resolve ", () => {
        const features = buildTestData([3,7,17,23,8,5,6,14,21,15,8,13,14,17,8,9,7,12,14]);
        const output = bestFit(features, 4);
        const expected = [
            { indexes: [ 2, 14, 10, 4, 1, 6 ], scenarios: 54 },
            { indexes: [ 13, 11, 17, 15, 5 ], scenarios: 56 },
            { indexes: [ 8, 12, 7, 16 ], scenarios: 56 },
            { indexes: [ 3, 9, 18, 0 ], scenarios: 55 }
          ];
        expect(output).toEqual(expected);
    });

    it("when there are some 0 scenarios features", () => {
        const features = buildTestData([3,7,0,23,0,5,6,0,21,0,8,13,14,17,8,9,7,12,14]);
        const output = bestFit(features, 4);
        const expected = [
            { indexes: [ 18, 10, 16, 1, 6 ], scenarios: 42 },
            { indexes: [ 13, 17, 15, 0 ], scenarios: 41 },
            { indexes: [ 8, 11, 14 ], scenarios: 42 },
            { indexes: [ 3, 12, 5 ], scenarios: 42 }
          ];
        expect(output).toEqual(expected);
    });

    it("when limit is higher than total scenarios ", () => {
        const features = buildTestData([3,2]);
        const output = bestFit(features, 4);
        const expected = [ { indexes: [ 0, 1 ], scenarios: 5 } ];
        //console.log(output);
        expect(output).toEqual(expected);
    });
    it("when limit is higher than total scenarios ", () => {
        const features = buildTestData([30,20]);
        const output = bestFit(features, 4);
        const expected =  [
            { indexes: [ 1 ], scenarios: 20 },
            { indexes: [ 0 ], scenarios: 30 }
          ];
        expect(output).toEqual(expected);
    });
    it("when scenarios are very less in a bin", () => {
        const features = buildTestData([3,2, 1, 1,1,1,1,1,1]);
        const output = bestFit(features, 4, 5);
        const expected = [
            { indexes: [ 1, 6, 5, 4, 2 ], scenarios: 6 },
            { indexes: [ 0, 8, 7, 3 ], scenarios: 6 }
          ];
        expect(output).toEqual(expected);
    });
    it("when scenarios count is high", () => {
        const features = buildTestData([56,57,54,51,59,52,54]);
        const output = bestFit(features, 4);
        const expected = [
            { indexes: [ 6, 2 ], scenarios: 108 },
            { indexes: [ 0, 5 ], scenarios: 108 },
            { indexes: [ 1, 3 ], scenarios: 108 },
            { indexes: [ 4 ], scenarios: 59 }
          ]
        expect(output).toEqual(expected);
    });
    it("when scenarios count is very low", () => {
        const features = buildTestData([3,1]);
        const output = bestFit(features, 7);
        const expected = [
            { indexes: [ 0, 1 ], scenarios: 4 }
        ];
        expect(output).toEqual(expected);
    });
});

function buildTestData(arr){
    const features = [];
    for(let i=0; i < arr.length; i++){
        features.push({
            fileName: "f"+i,
            stats: {
                total: arr[i],
                skipped: 0
            }
        });
    }
    return features;
}