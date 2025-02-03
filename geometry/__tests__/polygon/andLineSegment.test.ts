import { isLineSegmentInPolygon } from "@/geometry/polygon/andLineSegment";

describe("isLineSegmentInPolygon", () => {
    const square: Polygon = {
        id: "square",
        origin: [0, 0],
        vertices: [[0, 0], [3, 0], [3, 3], [0, 3]]
    };
    const concavePolygon: Polygon = {
        id: "concave",
        origin: [0, 0],
        vertices: [[0, 0], [1, 1], [2, 0], [2, 2], [0, 2]]
    };
    const blockyPolygon: Polygon = {
        id: "blocky",
        origin: [0, 0],
        vertices: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 0], [3, 0], [3, 2], [0, 2]]
    };

    it("should return true if line segment is in polygon's interior", () => {
        const lineSegment: LineSegment = [[1, 1], [2, 2]];
        expect(isLineSegmentInPolygon(lineSegment, square)).toBe(true);
    });

    it("should return true if line segment's interior is in polygon's interior and one or both endpoints are in polygon's boundary", () => {
        const lineSegmentOneEndpointOnBoundary: LineSegment = [[0, 1], [1, 1]];
        expect(isLineSegmentInPolygon(lineSegmentOneEndpointOnBoundary, square)).toBe(true);
        
        const lineSegmentBothEndpointsOnBoundary: LineSegment = [[0, 3], [3, 0]];
        expect(isLineSegmentInPolygon(lineSegmentBothEndpointsOnBoundary, square)).toBe(true);
    });

    it("should return true if line segment is in one of polygon's edges", () => {
        const lineSegmentInInterior: LineSegment = [[1, 0], [2, 0]];
        expect(isLineSegmentInPolygon(lineSegmentInInterior, square)).toBe(true);

        const lineSegmentSharesOneEndpoint: LineSegment = [[0, 3], [0, 1]];
        expect(isLineSegmentInPolygon(lineSegmentSharesOneEndpoint, square)).toBe(true);

        const lineSegmentIsEdge: LineSegment = [[3, 0], [3, 3]];
        expect(isLineSegmentInPolygon(lineSegmentIsEdge, square)).toBe(true);
    });

    it("should return false if line segment is completely outside polygon", () => {
        const lineSegment: LineSegment = [[5, 9], [9, 8]];
        expect(isLineSegmentInPolygon(lineSegment, square)).toBe(false);
    });

    it ("should return false if line segment's interior is outside polygon but one or both endpoints are in polygon's boundary", () => {
        const lineSegmentOneEndpointOnBoundary: LineSegment = [[-2, 3], [0, 0]];
        expect(isLineSegmentInPolygon(lineSegmentOneEndpointOnBoundary, concavePolygon)).toBe(false);

        const lineSegmentBothEndpointsOnBoundary: LineSegment = [[0, 0], [2, 0]];
        expect(isLineSegmentInPolygon(lineSegmentBothEndpointsOnBoundary, concavePolygon)).toBe(false);
    });

    it("should return false if line segment and a polygon edge have an interior-interior intersection", () => {
        const lineSegment: LineSegment = [[0.5, 0.5], [1.5, 0.5]];
        expect(isLineSegmentInPolygon(lineSegment, concavePolygon)).toBe(false);
    });

    it("should return false if line segment overlaps multiple edges", () => {
        const lineSegment: LineSegment = [[0.5, 0], [2.5, 0]];
        expect(isLineSegmentInPolygon(lineSegment, blockyPolygon)).toBe(false);
    });
});