import splitTarget, { bisectPolygonOnPath } from "./splitTarget";
import bunny from "@/assets/targets/bunny.json";

it("", () => {
    console.log(splitTarget(bunny.shape as Shape, 2, 5))
});

// it(`given a polygon and a bisecting path starting on a vertex and ending in the middle of an edge, 
//     bisectPolygonOnPath() works`, () => {
//     const polygon: Polygon = {
//         id: "polygon",
//         origin: [0, 0],
//         vertices: [
//             [0, 0],
//             [2, 0],
//             [2, 2],
//             [0, 2]
//         ]
//     };

//     const path: Point[] = [[2, 0], [1, 1], [1, 2]];

//     const [polygon1, polygon2] = bisectPolygonOnPath(polygon, path)

//     expect(polygon1.origin).toEqual([0, 0]);
//     expect(polygon1.vertices).toEqual([
//         [0, 0],
//         [2, 0],
//         [1, 1],
//         [1, 2],
//         [0, 2]
//     ]);

//     expect(polygon2.origin).toEqual([1, 0]);
//     expect(polygon2.vertices).toEqual([
//         [1, 0],
//         [1, 2],
//         [0, 2],
//         [0, 1]
//     ]);
// });

// it (`given a polygon and a bisecting path starting and ending on the same edge,
//     bisectPolygonOnPath() works`, () => {
//     const polygon: Polygon = {
//         id: "polygon",
//         origin: [0, 0],
//         vertices: [
//             [0, 0],
//             [2, 0],
//             [2, 2],
//             [0, 2]
//         ]
//     };

//     const path: Point[] = [
//         [0, 0],
//         [1, 1],
//         [1, 0]
//     ];

//     const [polygon1, polygon2] = bisectPolygonOnPath(polygon, path);

//     expect(polygon1.origin).toEqual([0, 0]);
//     expect(polygon1.vertices).toEqual([
//         [0, 0],
//         [1, 0],
//         [1, 1]
//     ]);

//     expect(polygon2.origin).toEqual([0, 0]);
//     expect(polygon2.vertices).toEqual([
//         [0, 0],
//         [1, 1],
//         [1, 0],
//         [2, 0],
//         [2, 2],
//         [0, 2]
//     ]);
// })