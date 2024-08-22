import { House } from "managers/HouseManager/HouseManager.types";
import { Vector3Tuple } from "three";

const GRID_SIZE = 100;
const MIN_DISTANCE = 2;

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

const generatePosition = (): Vector3Tuple => [
  getRandomNumber(-GRID_SIZE / 3, GRID_SIZE / 3),
  0,
  getRandomNumber(-GRID_SIZE / 3, GRID_SIZE / 3),
];

const createHouse = (): House => ({
  points: generateShape(),
  position: generatePosition(),
  rotation: [0, getRandomNumber(0, Math.PI * 2), 0],
  height: getRandomNumber(1, 20),
});

export const getHousesGenerator: () => House[] = () => {
  const numberOfHouses = Math.floor(getRandomNumber(1, 11));
  return Array.from({ length: numberOfHouses }, createHouse);
};
