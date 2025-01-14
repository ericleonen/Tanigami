import { standardizePolygon } from "../../geometry/polygon";
import * as fs from "fs";

/**
 * Accepts a name (do not include file suffix), takes the file in the "raw" folder with the given
 * name, generates a target JSON file, and save that file in the "json" folder.
 */
function rawToTargetJSON(name: string): void {
    fs.readFile(`data/targets/raw/${name}.fold`, "utf8", (err, data) => {
        if (err) {
            console.error(`Error reading raw file: ${name}.fold`);
            return;
        } else {
            const fold = JSON.parse(data);

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

            fs.writeFile(`data/targets/json/${name}.json`, JSON.stringify(shape), err => {
                if (err) {
                    console.error(`Error writing json file: ${name}.json`);
                } else {
                    console.log(`Successfully wrote ${name}.json`);
                }
            });
        }
    })
}

// main
const targetName = process.argv[2];

if (!targetName) { // target all in the raw folder
    const names: string[] = [];

    fs.readdirSync("data/targets/raw").forEach(file => {
        names.push(file.replace(".fold", ""));
    });

    console.log(`Converting ${names.length} raw files to target JSON files...`);
    names.forEach(rawToTargetJSON);
} else {
    console.log(`Converting raw file with name ${targetName} to target JSON file...`);
    rawToTargetJSON(targetName);
}

