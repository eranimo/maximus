/*****
*
*   Point.js
*
*   copyright 2001-2002, Kevin Lindsey
*
*****/

/*****
*
*   Point
*
*****/

/*****
*
*   constructor
*
*****/
function Point(x, y) {
    if ( arguments.length === 2 ) {
        this.x = x;
        this.y = y;
    } else if (arguments.length === 1){
        this.x = x.x;
        this.y = x.y;
    }
}


/*****
*
*   clone
*
*****/
Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};


/*****
*
*   add
*
*****/
Point.prototype.add = function(that) {
    return new Point(this.x+that.x, this.y+that.y);
};


/*****
*
*   addEquals
*
*****/
Point.prototype.addEquals = function(that) {
    this.x += that.x;
    this.y += that.y;

    return this;
};


/*****
*
*   offset - used in dom_graph
*
*   This method is based on code written by Walter Korman
*      http://www.go2net.com/internet/deep/1997/05/07/body.html
*   which is in turn based on an algorithm by Sven Moen
*
*****/
Point.prototype.offset = function(a, b) {
    var result = 0;

    if ( !( b.x <= this.x || this.x + a.x <= 0 ) ) {
        var t = b.x * a.y - a.x * b.y;
        var s;
        var d;

        if ( t > 0 ) {
            if ( this.x < 0 ) {
                s = this.x * a.y;
                d = s / a.x - this.y;
            } else if ( this.x > 0 ) {
                s = this.x * b.y;
                d = s / b.x - this.y
            } else {
                d = -this.y;
            }
        } else {
            if ( b.x < this.x + a.x ) {
                s = ( b.x - this.x ) * a.y;
                d = b.y - (this.y + s / a.x);
            } else if ( b.x > this.x + a.x ) {
                s = (a.x + this.x) * b.y;
                d = s / b.x - (this.y + a.y);
            } else {
                d = b.y - (this.y + a.y);
            }
        }

        if ( d > 0 ) {
            result = d;
        }
    }

    return result;
};


/*****
*
*   rmoveto
*
*****/
Point.prototype.rmoveto = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};


/*****
*
*   scalarAdd
*
*****/
Point.prototype.scalarAdd = function(scalar) {
    return new Point(this.x+scalar, this.y+scalar);
};


/*****
*
*   scalarAddEquals
*
*****/
Point.prototype.scalarAddEquals = function(scalar) {
    this.x += scalar;
    this.y += scalar;

    return this;
};


/*****
*
*   subtract
*
*****/
Point.prototype.subtract = function(that) {
    return new Point(this.x-that.x, this.y-that.y);
};


/*****
*
*   subtractEquals
*
*****/
Point.prototype.subtractEquals = function(that) {
    this.x -= that.x;
    this.y -= that.y;

    return this;
};


/*****
*
*   scalarSubtract
*
*****/
Point.prototype.scalarSubtract = function(scalar) {
    return new Point(this.x-scalar, this.y-scalar);
};


/*****
*
*   scalarSubtractEquals
*
*****/
Point.prototype.scalarSubtractEquals = function(scalar) {
    this.x -= scalar;
    this.y -= scalar;

    return this;
};


/*****
*
*   multiply
*
*****/
Point.prototype.multiply = function(scalar) {
    return new Point(this.x*scalar, this.y*scalar);
};


/*****
*
*   multiplyEquals
*
*****/
Point.prototype.multiplyEquals = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
};


/*****
*
*   divide
*
*****/
Point.prototype.divide = function(scalar) {
    return new Point(this.x/scalar, this.y/scalar);
};


/*****
*
*   divideEquals
*
*****/
Point.prototype.divideEquals = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;

    return this;
};


/*****
*
*   comparison methods
*
*   these were a nice idea, but ...  It would be better to define these names
*   in two parts so that the first part is the x comparison and the second is
*   the y.  For example, to test p1.x < p2.x and p1.y >= p2.y, you would call
*   p1.lt_gte(p2).  Honestly, I only did these types of comparisons in one
*   Intersection routine, so these probably could be removed.
*
*****/

/*****
*
*   compare
*
*****/
Point.prototype.compare = function(that) {
    return (this.x - that.x || this.y - that.y);
};


/*****
*
*   eq - equal
*
*****/
Point.prototype.eq = function(that) {
    return ( this.x == that.x && this.y == that.y );
};


/*****
*
*   lt - less than
*
*****/
Point.prototype.lt = function(that) {
    return ( this.x < that.x && this.y < that.y );
};


/*****
*
*   lte - less than or equal
*
*****/
Point.prototype.lte = function(that) {
    return ( this.x <= that.x && this.y <= that.y );
};


/*****
*
*   gt - greater than
*
*****/
Point.prototype.gt = function(that) {
    return ( this.x > that.x && this.y > that.y );
};


/*****
*
*   gte - greater than or equal
*
*****/
Point.prototype.gte = function(that) {
    return ( this.x >= that.x && this.y >= that.y );
};


/*****
*
*   utility methods
*
*****/

/*****
*
*   lerp
*
*****/
Point.prototype.lerp = function(that, t) {
    return new Point(
        this.x + (that.x - this.x) * t,
        this.y + (that.y - this.y) * t
    );
};


/*****
*
*   distanceFrom
*
*****/
Point.prototype.distanceFrom = function(that) {
    var dx = this.x - that.x;
    var dy = this.y - that.y;

    return Math.sqrt(dx*dx + dy*dy);
};


/*****
*
*   min
*
*****/
Point.prototype.min = function(that) {
    return new Point(
        Math.min( this.x, that.x ),
        Math.min( this.y, that.y )
    );
};


/*****
*
*   max
*
*****/
Point.prototype.max = function(that) {
    return new Point(
        Math.max( this.x, that.x ),
        Math.max( this.y, that.y )
    );
};


/*****
*
*   toString
*
*****/
Point.prototype.toString = function() {
    return this.x + "," + this.y;
};


/*****
*
*   get/set methods
*
*****/

/*****
*
*   setXY
*
*****/
Point.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
};


/*****
*
*   setFromPoint
*
*****/
Point.prototype.setFromPoint = function(that) {
    this.x = that.x;
    this.y = that.y;
};


/*****
*
*   swap
*
*****/
Point.prototype.swap = function(that) {
    var x = this.x;
    var y = this.y;

    this.x = that.x;
    this.y = that.y;

    that.x = x;
    that.y = y;
};


export default Point;
