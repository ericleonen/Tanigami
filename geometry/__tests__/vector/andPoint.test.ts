import { translate } from "@/geometry/vector/andPoint";

describe("translate", () => {
    it("should translate a point by a vector", () => {
        expect(translate([4, 9], [-2, 5])).toEqual([2, 14]);
    });
});