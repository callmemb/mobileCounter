import { describe, it, expect } from "vitest";
import { angleToValue, valueToAngle, angleToPosition, positionToAngle, semiCircle } from './circularGeometry';

describe('circularGeometry', () => {
  it('angleToValue should convert angle to value correctly', () => {
    const params = { angle: 90, minValue: 0, maxValue: 100, startAngle: 0, endAngle: 180 };
    expect(angleToValue(params)).toBe(50);
  });

  it('valueToAngle should convert value to angle correctly', () => {
    const params = { value: 50, minValue: 0, maxValue: 100, startAngle: 0, endAngle: 180 };
    expect(valueToAngle(params)).toBe(90);
  });

  it('angleToPosition should convert angle to position correctly', () => {
    const angle = { degree: 90, direction: 'ccw', axis: '+x' };
    const radius = 50;
    const svgSize = 100;
    const position = angleToPosition(angle, radius, svgSize);
    expect(position).toEqual({ x: 50, y: 0 });
  });

  it('positionToAngle should convert position to angle correctly', () => {
    const position = { x: 50, y: 0 };
    const svgSize = 100;
    const angleType = { direction: 'ccw', axis: '+x' };
    const angle = positionToAngle(position, svgSize, angleType);
    expect(angle).toBe(90);
  });

  // it('semiCircle should generate correct path data', () => {
  //   const opts = {
  //     startAngle: 0,
  //     endAngle: 180,
  //     radius: 50,
  //     svgSize: 100,
  //     direction: 'cw',
  //     angleType: { direction: 'ccw', axis: '+x' }
  //   };
  //   const pathData = semiCircle(opts);
  //   expect(pathData).toContain('M 50,50');
  //   expect(pathData).toContain('L 100,50');
  //   expect(pathData).toContain('A 50 50 0 1 1 0 50');
  // });
});
