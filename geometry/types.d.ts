/**
 * A 2-tuple specifying the x and y coordinates of a point. Points with greater x values are
 * positioned more right. Points with greater y values are positions more down. Units are grid
 * units.
 */
type Point = [number, number];

/**
 * A polygon defined by an absolute origin and a list of relatively-positioned vertices. Units are
 * grid units.
 */
type Polygon = {
    /**
     * The absolute position of the top left point of this Polygon's box. If omitted, treated as
     * [0, 0];
     */
    origin?: Point,
    /**
     * A list of Points that define the relative positions of vertices of this Polygon. Points are
     * ordered in a clockwise fashion, with the first Point having the least y value (and least x
     * value). All Points are relative to this Polygon's origin.
     */
    vertices: Point[]
}

/**
 * A shape defined by an absolute origin and a list of relatively-positioned Polygons. Units are
 * grid units.
 */
type Shape = {
    /**
     * The absolute position of the top left point of this Shape's box. If omitted, treated as
     * [0, 0].
     */
    origin?: Point,
    /**
     * A list of Polygons that define the structure of this Shape. The origins of each Polygon are
     * relative to this Shape's origin. The vertices of each Polygon remain relative to their
     * Polygon's origin.
     */
    polygons: Polygon[]
}