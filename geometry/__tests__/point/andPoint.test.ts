import { addPoints, arePointsEqual, getDistanceBetweenPoints, subtractPoints } from "@/geometry/point/andPoint";

describe("addPoints", () => {
    it("should properly add two points", () => {
        expect(addPoints([-1, 3], [2, 3])).toEqual([1, 6]);
    });
});

describe("subtractPoints", () => {
    it("should properly subtract two points", () => {
        expect(subtractPoints([4, 5], [-1, 4])).toEqual([5, 1]);
    });
});

describe("getDistanceBetweenPoints", () => {
    it("should properly compute the distance between two points", () => {
        expect(getDistanceBetweenPoints([1, 2], [2, 3])).toBeCloseTo(Math.SQRT2);
    });
});

describe("arePointsEqual", () => {
    it("should return true if points are exactly equal", () => {
        expect(arePointsEqual([-1, 1], [-1, 1])).toBe(true);
    });

    it("should return false if points are close, but not exactly equal", () => {
        expect(arePointsEqual([1, 1.001], [1, 1])).toBe(false);
    });

    it("should return false if the points are different", () => {
        expect(arePointsEqual([-1, 1], [1, -1])).toBe(false);
    });
});