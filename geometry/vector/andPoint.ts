import { addPoints } from "../point/andPoint";

/**
 * Returns the given point translated by the given vector.
 */
export function translate(point: Point, vector: Vector): Point {
    return addPoints(point, vector);
}