/**
 * Returns the magnitude of the given vector.
 */
export function getVectorMagnitude(vector: Vector): number {
    return Math.sqrt(vector[0]**2 + vector[1]**2);
}