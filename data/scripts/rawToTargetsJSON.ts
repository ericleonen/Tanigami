import { standardizePolygon } from "../../geometry/polygon";
import * as fs from "fs";

/**
 * Converts the raw FOLD files into a JSON file listing of all target shapes. This JSON file will
 * have the format { "targetName": targetShape }.
 */
function rawToTargetsJSON(): void {
    const names = fs.readdirSync("data/targets/raw")
        .map(fileName => fileName.replace(".fold", ""));

    const targets: { [name: string]: Shape } = {};

    names.forEach(name => {
        const fold = JSON.parse(fs.readFileSync(`data/targets/raw/${name}.fold`, "utf8"));
        
        const vertices: Point[] = fold["vertices_coords"];
        const polygonsVerticesIndexes: number[][] = fold["faces_vertices"];

        const shape: Shape = polygonsVerticesIndexes.map(polygonVerticesIndexes => {
            const polygonVertices = polygonVerticesIndexes.map(index => vertices[index]);

            let polygon = standardizePolygon({
                id: crypto.randomUUID(),
                origin: [0, 0],
                vertices: polygonVertices
            });
            polygon.dimensions = undefined;
            polygon.signedArea = undefined;

            return polygon;
        });

        targets[name] = shape;
    });

    fs.writeFileSync("data/targets/index.json", JSON.stringify(targets));
}

// main
rawToTargetsJSON();

