import { isPolygonInPolygon } from "@/geometry/polygon/andPolygon";

describe("isPolygonInPolygon", () => {
    const square: Polygon = {
        id: "square",
        origin: [-2, -2],
        vertices: [[0, 0], [4, 0], [4, 4], [0, 4]]
    };
    const insideSquare: Polygon = {
        id: "insideSquare",
        origin: [-1, -1],
        vertices: [[0, 0], [2, 0], [2, 2], [0, 2]]
    };
    
    it("should return true if inner polygon is in the outer polygon", () => {
        expect(isPolygonInPolygon(insideSquare, square)).toBe(true);
        expect(isPolygonInPolygon(insideSquare, insideSquare)).toBe(true);
    });

    it("should return false if the inner polygon is partially out of the outer polygon", () => {
        expect(isPolygonInPolygon(square, insideSquare)).toBe(false);
        const shiftedSquare: Polygon = {
            id: "shiftedSquare",
            origin: [0, 0],
            vertices: [[0, 0], [4, 0], [4, 4], [0, 4]]
        }
        expect(isPolygonInPolygon(square, shiftedSquare)).toBe(false);
    });

    it("should return false if inner polygon is completely out of the outer polygon", () => {
        const wayShiftedSquare: Polygon = {
            id: "wayShiftedSquare",
            origin: [20, 20],
            vertices: [[0, 0], [4, 0], [4, 4], [0, 4]]
        };
        expect(isPolygonInPolygon(wayShiftedSquare, square)).toBe(false);
    });
});