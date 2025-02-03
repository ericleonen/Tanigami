import { getIntegerPointsOnLineSegment } from "@/geometry/lineSegment";
import { arePolygonVerticesClockwise, clampPolygonToBoundingBox, getAbsolutePolygonVertices, getIntegerPointsOnPolygonBoundary, getPolygonArea, getPolygonCentroid, getPolygonDimensions, getPolygonEdges, getSmallestAngleOfPolygon, getSmallestWidthOfPolygon, standardizePolygon } from "../../polygon/index";

const octagon: Polygon = {
    id: "octagon",
    origin: [-2, -2],
    vertices: [[1, 0], [3, 0], [4, 1], [4, 3], [3, 4], [1, 4], [0, 3], [0, 1]]
};

const concavePolygon: Polygon = {
    id: "concave",
    origin: [0, 0],
    vertices: [[0, 0], [1, 1], [2, 0], [2, 2], [0, 2]]
};

describe("getPolygonDimensions", () => {
    it("should properly compute the dimensions of a polygon", () => {
        const polygon = {...octagon};
        const { height, width } = getPolygonDimensions(polygon);

        expect(height).toBe(4);
        expect(width).toBe(4);
    });
});

describe("getAbsolutePolygonVertices", () => {
    it("should properly compute the absolute vertices of a polygon", () => {
        const absoluteVertices = getAbsolutePolygonVertices(octagon);

        expect(absoluteVertices).toEqual([
            [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1]
        ]);
    });
});

describe("getPolygonEdges", () => {
    it("should properly compute the absolute edges of a polygon if absolute is true", () => {
        const absoluteEdges = getPolygonEdges(octagon, true);
        expect(absoluteEdges).toEqual([
            [[-1, -2], [1, -2]],
            [[1, -2], [2, -1]],
            [[2, -1], [2, 1]],
            [[2, 1], [1, 2]],
            [[1, 2], [-1, 2]],
            [[-1, 2], [-2, 1]],
            [[-2, 1], [-2, -1]],
            [[-2, -1], [-1, -2]]
        ]);
    });

    it("should properly compute the relative edges of a polygon if absolute is false", () => {
        const relativeEdges = getPolygonEdges(octagon, false);
        // [[1, 0], [3, 0], [4, 1], [4, 3], [3, 4], [1, 4], [0, 3], [0, 1]]
        expect(relativeEdges).toEqual([
            [[1, 0], [3, 0]],
            [[3, 0], [4, 1]],
            [[4, 1], [4, 3]],
            [[4, 3], [3, 4]],
            [[3, 4], [1, 4]],
            [[1, 4], [0, 3]],
            [[0, 3], [0, 1]],
            [[0, 1], [1, 0]]
        ]);
    });
});

describe("getPolygonArea", () => {
    it("should properly compute the area of a convex polygon", () => {
        const polygon = {...octagon};
        expect(getPolygonArea(polygon)).toBeCloseTo(14);
    });

    it("should properly compute the area of a concave polygon", () => {
        const polygon = {...concavePolygon};
        expect(getPolygonArea(polygon)).toBeCloseTo(3);
    });
});

describe("arePolygonVerticesClockwise", () => {
    it("should return true if the vertices are in a clockwise orientation", () => {
        const clockwisePolygon = {...concavePolygon};
        expect(arePolygonVerticesClockwise(clockwisePolygon)).toBe(true);
    });
    
    it("should return false if the vertices are in a counter-clockwise orientation", () => {
        const counterClockwisePolygon: Polygon = {
            ...concavePolygon,
            vertices: concavePolygon.vertices.toReversed()
        };
        expect(arePolygonVerticesClockwise(counterClockwisePolygon)).toBe(false);
    });
});

describe("getIntegerPointsOnPolygonEdges", () => {
    it("should properly compute all integer points on a polygon's boundary", () => {
        const points = getIntegerPointsOnPolygonBoundary(concavePolygon);
        expect(points).toEqual([
            [0, 0], [1, 1], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]
        ]);
    });
});

describe("standardizePolygon", () => {
    it("should properly standardize a polygon's vertices and origin", () => {
        const vertices = getAbsolutePolygonVertices(octagon).toReversed();
        vertices.push(vertices.shift()!);
        const polygon: Polygon = {
            ...octagon,
            origin: [0, 0],
            vertices
        };
        const standardPolygon = standardizePolygon(polygon);
        standardPolygon.signedArea = undefined;

        expect(standardPolygon).toEqual(octagon);
    });
});

describe("getSmallestAngleOfPolygon", () => {
    it("should properly compute the smallest interior or exterior angle of a polygon", () => {
        expect(getSmallestAngleOfPolygon(octagon)).toBeCloseTo(135);
        expect(getSmallestAngleOfPolygon(concavePolygon)).toBeCloseTo(45);
    });
});

describe("getSmallestWidthOfPolygon", () => {
    it("should properly compute the smallest interior width of a polygon", () => {
        expect(getSmallestWidthOfPolygon(octagon)).toBeCloseTo(1);
        expect(getSmallestWidthOfPolygon(concavePolygon)).toBeCloseTo(1);
    });
});

describe("getPolygonCentroid", () => {
    it("should properly compute the absolute centroid of a polygon if absolute is true", () => {
        expect(getPolygonCentroid(octagon, true)).toEqual([0, 0]);
        expect(getPolygonCentroid(concavePolygon, true)).toEqual([1, 1]);
    });

    it("should properly compute the relative centroid of a polygon if absolute is false", () => {
        expect(getPolygonCentroid(octagon, false)).toEqual([2, 2]);
        expect(getPolygonCentroid(concavePolygon, false)).toEqual([1, 1]);
    });
});

describe("clampPolygonToBoundingBox", () => {
    it("should properly clamp a polygon into the bounding box", () => {
        const polygon = {...octagon};
        const boundingBox: Box = {
            origin: [0, 0],
            height: 10,
            width: 10
        };

        const clampedPolygon = clampPolygonToBoundingBox(polygon, boundingBox);
        clampedPolygon.dimensions = undefined

        expect(clampedPolygon).toEqual({
            ...octagon,
            origin: [0, 0]
        });
    });
});