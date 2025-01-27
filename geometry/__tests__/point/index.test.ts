import { roundPoint, scalePoint } from "@/geometry/point";

describe("scalePoint", () => {
    it("should properly scale a point by 2", () => {
        expect(scalePoint(2, [1, 2])).toEqual([2, 4]);
        expect(scalePoint(2, [-1, 0])).toEqual([-2, 0]);
    });
});

describe("roundPoint", () => {
    it("should properly round a point", () => {
        expect(roundPoint([1.1, 1.9])).toEqual([1, 2]);
        expect(roundPoint([0.9, 2.1])).toEqual([1, 2]);
    })
});