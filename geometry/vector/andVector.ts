import { getVectorMagnitude } from ".";

/**
 * Returns the dot product of the given vectors.
 */
export function dot(vector1: Vector, vector2: Vector): number {
    return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}

/**
 * Returns the (positive) angle between the given vectors in degrees.
 */
export function getAngleBetweenVectors(vector1: Vector, vector2: Vector): number {
    return Math.acos(
        dot(vector1, vector2) / getVectorMagnitude(vector1) / getVectorMagnitude(vector2)
    ) * 180 / Math.PI;
}