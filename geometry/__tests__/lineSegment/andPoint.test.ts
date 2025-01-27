import { getDistanceBetweenPointAndLineSegment, getNearestPointOnLineSegmentToPoint, isPointInLineSegment } from "@/geometry/lineSegment/andPoint";
import { getDistanceBetweenPoints } from "@/geometry/point/andPoint";

describe("isPointInLineSegment", () => {
    const lineSegment: LineSegment = [[2, 3], [4, 5]];

    it("should return true if point is in line segment's interior", () => {
        expect(isPointInLineSegment([3, 4], lineSegment)).toBe(true);
        expect(isPointInLineSegment([3, 4], lineSegment, false)).toBe(true);
    });

    it("should return true if point is an endpoint of line segment and includeEndpoints is true", () => {
        expect(isPointInLineSegment([2, 3], lineSegment, true)).toBe(true);
        expect(isPointInLineSegment([4, 5], lineSegment, true)).toBe(true);
    });

    it("should return false if point is outside line segment", () => {
        expect(isPointInLineSegment([8, 9], lineSegment)).toBe(false);
    });

    it("should return false if point is an endpoint of line segment and includeEndpoints is false", () => {
        expect(isPointInLineSegment([2, 3], lineSegment, false)).toBe(false);
        expect(isPointInLineSegment([4, 5], lineSegment, false)).toBe(false);
    });
});

describe("getNearestPointOnLineSegmentToPoint", () => {
    const lineSegment: LineSegment = [[-3, 2], [1, 3]];
    
    it("should find the nearest point if the nearest point is in line segment's interior", () => {
        const nearestPoint = getNearestPointOnLineSegmentToPoint([-1, 2], lineSegment);
        const actualNearestPoint: Point = [-1.11765, 2.47059];
        expect(nearestPoint[0]).toBeCloseTo(actualNearestPoint[0], 4);
        expect(nearestPoint[1]).toBeCloseTo(actualNearestPoint[1], 4);
    });

    it("should find nearest point if the nearest poitn is one of line segment's endpoints", () => {
        expect(getNearestPointOnLineSegmentToPoint([-4, 1], lineSegment)).toEqual([-3, 2]);
        expect(getNearestPointOnLineSegmentToPoint([2, 3], lineSegment)).toEqual([1, 3]);
    });
});

describe("getDistanceBetweenPointAndLineSegment", () => {
    it("should properly compute the distance between a point and a line segment", () => {
        const lineSegment: LineSegment = [[2, 3], [1, 1]];
        expect(getDistanceBetweenPointAndLineSegment([2, 2], lineSegment)).toBeCloseTo(0.4472135955, 9);
    });
});