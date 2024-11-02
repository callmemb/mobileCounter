const visualShift = 90;

type AngleToValueParams = {
  angle: number;
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
};

export function angleToValue(params: AngleToValueParams): number {
  const { angle, minValue, maxValue, startAngle, endAngle } = params;
  const startAngleShifted = startAngle;
  const endAngleShifted = endAngle;
  if (angle < startAngleShifted) {
    return minValue;
  } else if (angle > endAngleShifted) {
    return maxValue;
  } else {
    const ratio = (angle - startAngle) / (endAngle - startAngle);
    const value = (ratio) * (maxValue - minValue) + minValue;
    return value;
  }
}

type ValueToAngleParams = {
  value: number;
  minValue: number;
  maxValue: number;
  startAngle: number;
  endAngle: number;
};

export function valueToAngle(params: ValueToAngleParams): number {
  const { value, minValue, maxValue, startAngle, endAngle } = params;
  if (endAngle <= startAngle) {
    throw new Error("endAngle must be greater than startAngle");
  }
  const ratio = (value - minValue) / (maxValue - minValue);
  const angle = ratio * (endAngle - startAngle) + startAngle;
  return angle;
}

type Position = {
  x: number;
  y: number;
};

export function angleToPosition(
  degree: number,
  radius: number,
  svgSize: number
): Position {
  // Convert to standard angle (counterclockwise from positive x axis)
  const standardAngle = (270 - visualShift - degree) % 360;
  const angleInRad = (standardAngle / 180) * Math.PI;

  let dX: number;
  let dY: number;

  if (angleInRad <= Math.PI) {
    if (angleInRad <= Math.PI / 2) {
      dY = Math.sin(angleInRad) * radius;
      dX = Math.cos(angleInRad) * radius;
    } else {
      dY = Math.sin(Math.PI - angleInRad) * radius;
      dX = Math.cos(Math.PI - angleInRad) * radius * -1;
    }
  } else {
    if (angleInRad <= Math.PI * 1.5) {
      dY = Math.sin(angleInRad - Math.PI) * radius * -1;
      dX = Math.cos(angleInRad - Math.PI) * radius * -1;
    } else {
      dY = Math.sin(2 * Math.PI - angleInRad) * radius * -1;
      dX = Math.cos(2 * Math.PI - angleInRad) * radius;
    }
  }

  const x = dX + svgSize / 2;
  const y = svgSize / 2 - dY;

  return { x, y };
}

export function positionToAngle(position: Position, svgSize: number): number {
  const dX = position.x - svgSize / 2;
  const dY = svgSize / 2 - position.y;
  let theta = Math.atan2(dY, dX);
  if (theta < 0) {
    theta = theta + 2 * Math.PI;
  }
  let degree = (theta / Math.PI) * 180;

  // Convert to clockwise from negative y axis
  degree = (720 - visualShift - degree) % 360;
  return degree;
}

export function processSelection(
  x: number,
  y: number,
  container: HTMLElement,
  size: number,
  minValue: number,
  maxValue: number,
  safeStartAngle: number,
  safeEndAngle: number
): number {
  const c = container;

  const svgPoint = c.getBoundingClientRect();
  const point = { x: x - svgPoint.left, y: y - svgPoint.top };
  const angle = positionToAngle(point, size);
  const value = angleToValue({
    angle,
    minValue,
    maxValue,
    startAngle: safeStartAngle,
    endAngle: safeEndAngle,
  });
  return Math.round(value);
}


export function debounce(func: Function, wait: number, immediate: boolean) {
  let timeout: number | null;
  return function (this: any) {
    let context = this;
    let args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}