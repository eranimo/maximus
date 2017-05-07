import Point from '../src/point';
import Rectangle from '../src/rectangle';

describe('Rectangle', () => {
  const point: Point = new Point(10, 10);
  const rect: Rectangle = new Rectangle(point, 10, 10);

  it('containsPoint', () => {
    expect(rect.containsPoint(new Point(10, 10))).toEqual(true);
    expect(rect.containsPoint(new Point(15, 15))).toEqual(true);
    expect(rect.containsPoint(new Point(20, 20))).toEqual(true);
  });
});
