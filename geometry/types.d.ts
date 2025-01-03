/**
 * A 2-tuple specifying the x and y coordinates of a point. Points with greater x values are
 * positioned more right. Points with greater y values are positions more down. Units are grid
 * units.
 */
type Point = [number, number];

/**
 * A 2-tuple specifying the two endpoints of a line segment.
 */
type LineSegment = [Point, Point];

/**
 * A 2-tuple specifying the bounds of an interval.
 */
type Interval = [number, number];

/**
 * An object describing how many grid cell rows and columns a polygon or shape's box takes up.
 */
type Dimensions = {
    rows: number,
    columns: number
}

/**
 * A polygon defined by an absolute origin and a list of relatively-positioned vertices. Units are
 * grid units.
 */
type Polygon = {
    id: string,
    /**
     * The absolute position of the top left point of this polygon's box.
     */
    origin: Point,
    /**
     * A list of points that define the relative positions of vertices of this Polygon. Points are
     * ordered in a clockwise fashion, with the first point having the least y value (and least x
     * value). All points are relative to this polygon's origin.
     */
    vertices: Point[],
    /**
     * The number of rows and columns in grid cell units this polygon takes up. Do not access this
     * directly, but use getPolygonDimensions.
     */
    dimensions?: Dimensions,
    /**
     * The area of this polygon. Do not acces this directly, but use getPolygonArea.
     */
    area?: number
}

/**
 * A shape defined by a list of polygons. No two polygons can share an edge or intersect.
 */
type Shape = Polygon[];