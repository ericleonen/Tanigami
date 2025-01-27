import { areApproximatelyEqual, clamp } from "../number";

describe("clamp", () => {
    const interval: [number, number] = [1, 2];

    it("should clamp values less than or equal to the interval's lower bound to the lower bound", () => {
        expect(clamp(0, interval)).toBe(1);
        expect(clamp(1, interval)).toBe(1);
    });

    it("should not change values inside the interval", () => {
        expect(clamp(1.5, interval)).toBe(1.5);
    });

    it("should clamp values greater than or equal to the interval's upper bound to the upper bound", () => {
        expect(clamp(3, interval)).toBe(2);
        expect(clamp(2, interval)).toBe(2);
    });
});

describe("areApproximatelyEqual", () => {
    const tolerance = 0.01;
    
    it("should return true if values are strictly within tolerance of eachother", () => {
        expect(areApproximatelyEqual(1, 1.001, tolerance)).toBe(true);
        expect(areApproximatelyEqual(1, 0.999, tolerance)).toBe(true);
    });

    it("should return false if values are tolerance or greater away", () => {
        expect(areApproximatelyEqual(1, 1.01, tolerance)).toBe(false);
        expect(areApproximatelyEqual(1, 0.99, tolerance)).toBe(false);
        expect(areApproximatelyEqual(1, 1.02, tolerance)).toBe(false);
        expect(areApproximatelyEqual(1, 0.98, tolerance)).toBe(false);
    });
});