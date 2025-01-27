import { dot, getAngleBetweenVectors } from "@/geometry/vector/andVector";

describe("dot", () => {
    it("should properly compute the dot product of two vectors", () => {
        expect(dot([-4, 5], [2, 9])).toBe(37);
    });
});

describe("getAngleBetweenVectors", () => {
    it("should properly compute the acute angle of two vectors", () => {
        expect(getAngleBetweenVectors([1, 0], [1, 1])).toBeCloseTo(45);
        expect(getAngleBetweenVectors([1, 1], [1, 0])).toBeCloseTo(45);
    });

    it("should properly compute the obtuse angle of two vectors", () => {
        expect(getAngleBetweenVectors([1, 1], [-1, 0])).toBeCloseTo(135);
        expect(getAngleBetweenVectors([-1, 0], [1, 1])).toBeCloseTo(135);
    });

    it("should properly compute the right angle between two vectors", () => {
        expect(getAngleBetweenVectors([1, 0], [0, 1])).toBeCloseTo(90);
        expect(getAngleBetweenVectors([0, 1], [1, 0])).toBeCloseTo(90);
    });
});