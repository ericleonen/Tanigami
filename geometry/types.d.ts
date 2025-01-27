/**
 * A 2-tuple specifying the x and y coordinates of a point.
 */
type Point = [number, number];

/**
 * A 2-tuple specifying the x and y components of a vector.
 */
type Vector = [number, number];

/**
 * A 2-tuple specifying the two endpoints of a line segment. 
 */
type LineSegment = [Point, Point];

/**
 * An object describing the height and width of something.
 */
type Dimensions = {
    height: number,
    width: number
}

/**
 * A box defined by an absolute origin and its dimensions.
 */
type Box = {
    origin: Point,
} & Dimensions;

/**
 * A polygon defined by a unique id, an absolute origin, and a list of relative vertices. A
 * standardized polygon has its origin at the top, left point of its box and its vertices in
 * clockwise order with its first vertex being the top, left vertex.
 * 
 * In most cases, do not access a polygon's optional properties dimensions, signedArea, or centroid
 * directly, but use getPolygonDimensions, getPolygonArea, and getPolygonCentroid respectively
 * instead.
 */
type Polygon = {
    id: string,
    origin: Point,
    vertices: Point[],
    dimensions?: Dimensions,
    signedArea?: number,
    centroid?: Point
}

/**
 * A shape defined by a list of polygons.
 * 
 * In general, no two polygons should share an edge or intersect.
 */
type Shape = Polygon[];