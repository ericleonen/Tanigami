/**
 * A 2-tuple specifying the x and y coordinates of a point. Points with greater x values are
 * positioned more right. Points with greater y values are positions more down.
 */
type Point = [number, number];

/**
 * A polygon defined by an (optional) absolute origin and a list of relatively-positioned vertices.
 */
type Polygon = {
    /**
     * The (optional) absolute position of the top left point of this Polygon's box.
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
 * A shape defined by an (optional) absolute origin and a list of relatively-positioned Polygons.
 */
type Shape = {
    /**
     * The (optional) absolute position of the top left point of this Shape's box.
     */
    origin?: Point,
    /**
     * A list of Polygons that define the structure of this Shape.
     */
    polygons: Polygon[]
}