import { isPointInPolygon } from "@/geometry/polygon/andPoint";

describe("isPointInPolygon", () => {
    const polygon: Polygon = {
        id: "concave",
        origin: [0, 0],
        vertices: [[0, 0], [1, 1], [2, 0], [2, 2], [0, 2]]
    };

    it("should return true if the point is in polygon's interior", () => {
        const point: Point = [0.25, 0.5];
        expect(isPointInPolygon(point, polygon, true)).toBe(true);
        expect(isPointInPolygon(point, polygon, false)).toBe(true);
    });

    it("should return false if the point is completely outside the polygon", () => {
        const point: Point = [7, 3];
        expect(isPointInPolygon(point, polygon, true)).toBe(false);
        expect(isPointInPolygon(point, polygon, false)).toBe(false);
    });

    it("should return true if the point is in polygon's boundary and includeBoundary is true", () => {
        const pointIsVertex: Point = [2, 0];
        expect(isPointInPolygon(pointIsVertex, polygon, true)).toBe(true);
        
        const pointOnEdge: Point = [0.5, 0.5];
        expect(isPointInPolygon(pointOnEdge, polygon, true)).toBe(true);
    });

    it("should return false if the point is in polygon's boundary and includeBoundary is false", () => {
        const pointIsVertex: Point = [2, 0];
        expect(isPointInPolygon(pointIsVertex, polygon, false)).toBe(false);
        
        const pointOnEdge: Point = [0.5, 0.5];
        expect(isPointInPolygon(pointOnEdge, polygon, false)).toBe(false);
    });
});