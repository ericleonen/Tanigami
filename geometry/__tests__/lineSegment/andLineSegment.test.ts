import { areLineSegmentsEqual, doLineSegmentsIntersect } from "@/geometry/lineSegment/andLineSegment";

describe("areLineSegmentsEqual", () => {
    it("should return true if line segments are exactly equal", () => {
        const lineSegment1: LineSegment = [[2, 2], [4, 5]];
        const lineSegment2: LineSegment = [[2, 2], [4, 5]];

        expect(areLineSegmentsEqual(lineSegment1, lineSegment2)).toBe(true);
    });

    it("should return false if line segments share only one endpoint", () => {
        const lineSegment1: LineSegment = [[1, 1], [4, 9]];
        const lineSegment2: LineSegment = [[1, 1], [4, 8]];

        expect(areLineSegmentsEqual(lineSegment1, lineSegment2)).toBe(false);
    });

    it("should return false if the line segments share no endpoints", () => {
        const lineSegment1: LineSegment = [[1, 1], [4, 9]];
        const lineSegment2: LineSegment = [[1, 2], [4, 8]];

        expect(areLineSegmentsEqual(lineSegment1, lineSegment2)).toBe(false);
    });
});

describe("doLineSegmentsIntersect", () => {
    it("should return true if the line segments' intersection is in both line segments' interior", () => {
        const lineSegment1: LineSegment = [[0, 0], [1, 2]];
        const lineSegment2: LineSegment = [[0, 2], [1, 0]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, true)).toBe(true);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, false)).toBe(true);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, true)).toBe(true);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, false)).toBe(true);
    });
    
    it("should return true if the line segments' intersection is exactly one line segment's endpoint and includeInteriorEndpoint is true", () => {
        const lineSegment1: LineSegment = [[0, 0], [1, 1]];
        const lineSegment2: LineSegment = [[2, 0], [0, 2]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, true)).toBe(true);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, false)).toBe(true);
    });

    it("should return false if the line segments' intersection is exactly one line segment's endpoint and includeInteriorEndpoint is false", () => {
        const lineSegment1: LineSegment = [[0, 0], [1, 1]];
        const lineSegment2: LineSegment = [[2, 0], [0, 2]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, true)).toBe(false);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, false)).toBe(false);
    });

    it("should return true if the line segments' intersection is an endpoint of both line segments and includeEndpointEndpoint is true", () => {
        const lineSegment1: LineSegment = [[1, 1], [3, 2]];
        const lineSegment2: LineSegment = [[1, 1], [4, 9]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, true)).toBe(true);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, true)).toBe(true);
    });

    it("should return false if the line segments' intersection is an endpoint of both line segments and includeEndpointEndpoint is false", () => {
        const lineSegment1: LineSegment = [[1, 1], [3, 2]];
        const lineSegment2: LineSegment = [[1, 1], [4, 9]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, true, false)).toBe(false);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2, false, false)).toBe(false);
    });

    it("should return false if the line segments are parallel", () => {
        const lineSegment1: LineSegment = [[2, 3], [6, 2]];
        const lineSegment2: LineSegment = [[0, 0], [4, -1]];

        expect(doLineSegmentsIntersect(lineSegment1, lineSegment1)).toBe(false);
        expect(doLineSegmentsIntersect(lineSegment1, lineSegment2)).toBe(false);
    });
});