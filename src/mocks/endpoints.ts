import { House } from "managers/HouseManager/HouseManager.types";
import { Vector3Tuple } from "three";

const GRID_SIZE = 100;
const SAFETY_MARGIN = 4;

const getRandomNumber = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const generateShape = (): [
  Vector3Tuple,
  Vector3Tuple,
  Vector3Tuple,
  Vector3Tuple
] => {
  const width = getRandomNumber(1, 30);
  const depth = getRandomNumber(1, 30);

  return [
    [
      -width / 2 + getRandomNumber(-5, 5),
      0,
      -depth / 2 + getRandomNumber(-5, 5),
    ],
    [
      width / 2 + getRandomNumber(-5, 5),
      0,
      -depth / 2 + getRandomNumber(-5, 5),
    ],
    [width / 2 + getRandomNumber(-5, 5), 0, depth / 2 + getRandomNumber(-5, 5)],
    [
      -width / 2 + getRandomNumber(-5, 5),
      0,
      depth / 2 + getRandomNumber(-5, 5),
    ],
  ];
};

const rotatePoint = (point: Vector3Tuple, angle: number): Vector3Tuple => {
  const [x, y, z] = point;
  const cosTheta = Math.cos(angle);
  const sinTheta = Math.sin(angle);
  const rotatedX = cosTheta * x - sinTheta * z;
  const rotatedZ = sinTheta * x + cosTheta * z;
  return [rotatedX, y, rotatedZ];
};

const getRotatedExtent = (
  shape: [Vector3Tuple, Vector3Tuple, Vector3Tuple, Vector3Tuple],
  rotation: number
): number => {
  const rotatedShape = shape.map((point) => rotatePoint(point, rotation));

  const xCoords = rotatedShape.map((point) => point[0]);
  const zCoords = rotatedShape.map((point) => point[2]);

  const maxX = Math.max(...xCoords);
  const minX = Math.min(...xCoords);
  const maxZ = Math.max(...zCoords);
  const minZ = Math.min(...zCoords);

  return Math.max(maxX - minX, maxZ - minZ);
};

const generatePosition = (extent: number): Vector3Tuple => {
  const margin = extent / 2 + SAFETY_MARGIN;

  let x = getRandomNumber(-GRID_SIZE / 2 + margin, GRID_SIZE / 2 - margin);
  let y = 0;
  let z = getRandomNumber(-GRID_SIZE / 2 + margin, GRID_SIZE / 2 - margin);

  x = Math.max(-GRID_SIZE / 2 + margin, Math.min(x, GRID_SIZE / 2 - margin));
  z = Math.max(-GRID_SIZE / 2 + margin, Math.min(z, GRID_SIZE / 2 - margin));

  return [x, y, z];
};

const isColliding = (newHouse: House, existingHouses: House[]): boolean => {
  const newExtent = getRotatedExtent(newHouse.points, newHouse.rotation[1]);
  const newBounds = {
    minX: newHouse.position[0] - newExtent / 2,
    maxX: newHouse.position[0] + newExtent / 2,
    minZ: newHouse.position[2] - newExtent / 2,
    maxZ: newHouse.position[2] + newExtent / 2,
  };

  for (const existingHouse of existingHouses) {
    const existingExtent = getRotatedExtent(
      existingHouse.points,
      existingHouse.rotation[1]
    );
    const existingBounds = {
      minX: existingHouse.position[0] - existingExtent / 2,
      maxX: existingHouse.position[0] + existingExtent / 2,
      minZ: existingHouse.position[2] - existingExtent / 2,
      maxZ: existingHouse.position[2] + existingExtent / 2,
    };
    const overlapX =
      newBounds.maxX > existingBounds.minX &&
      newBounds.minX < existingBounds.maxX;
    const overlapZ =
      newBounds.maxZ > existingBounds.minZ &&
      newBounds.minZ < existingBounds.maxZ;

    if (overlapX && overlapZ) {
      return true;
    }
  }
  return false;
};

const createHouse = (existingHouses: House[]): House | null => {
  const shape = generateShape();
  const rotation = getRandomNumber(0, Math.PI * 2);
  const extent = getRotatedExtent(shape, rotation);
  const position = generatePosition(extent);

  const newHouse: House = {
    points: shape,
    position: position,
    rotation: [0, rotation, 0] as Vector3Tuple,
    height: getRandomNumber(1, 20),
  };

  if (!isColliding(newHouse, existingHouses)) {
    return newHouse;
  }
  return null;
};

export const getHousesGenerator = (): House[] => {
  const numberOfHouses = Math.floor(getRandomNumber(1, 11));
  const houses: House[] = [];

  for (let i = 0; i < numberOfHouses; i++) {
    let newHouse: House | null;
    let attempts = 0;
    do {
      newHouse = createHouse(houses);
      attempts++;
    } while (newHouse === null && attempts < 2000);
    if (newHouse !== null) {
      houses.push(newHouse);
    } else {
      console.warn(`Failed to place house ${i + 1} after 2000 attempts.`);
    }
  }

  return houses;
};
