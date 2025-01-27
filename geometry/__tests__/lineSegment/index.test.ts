import { getIntegerPointsOnLineSegment, getLineSegmentMidpoint } from "@/geometry/lineSegment";
import { arePointsEqual } from "@/geometry/point/andPoint";

describe("getIntegerPointsOnLineSegment", () => {
    it("should find all the integer points of a diagonal line segment", () => {
        const lineSegment: LineSegment = [[-1, -1], [3, 3]];
        const integerPoints = getIntegerPointsOnLineSegment(lineSegment);

        for (let i = -1; i <= 3; i++) {
            const expectedPoint: Point = [i, i];
            expect(integerPoints.some(integerPoint => 
                arePointsEqual(integerPoint, expectedPoint)
            )).toBe(true);
        }

        expect(integerPoints.length).toBe(5);
    });
});

describe("getLineSegmentMidpoint", () => {
    it("should properly compute the midpoint of a line segment", () => {
        const lineSegment: LineSegment = [[3, 4], [-1, 2]];
        expect(getLineSegmentMidpoint(lineSegment)).toEqual([1, 3]);
    });
})