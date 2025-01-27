import { getVectorMagnitude } from "@/geometry/vector";

describe("getVectorMagnitude", () => {
    it("should properly compute the magnitude of a vector", () => {
        expect(getVectorMagnitude([3, 4])).toBe(5);
    });
});