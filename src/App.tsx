import {
  Euler,
  Matrix4,
  Object3D,
  Quaternion,
  Vector3,
  Vector3Tuple,
} from "three";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { House } from "managers/HouseManager/HouseManager.types";
import AxesHelper from "components/AxesHelper";
import CameraControls from "components/CameraControls";
import Canvas from "components/Canvas";
import Container from "components/Container";
import GridHelper from "components/GridHelper";
import HouseTable from "components/HouseTable";
import HouseManager from "managers/HouseManager";
import Light from "components/Light";
import PivotControls from "components/PivotControls";

/** Constants */
const CAMERA_POSITION = [10, 10, 10] as Vector3Tuple;
const GRID_POSITION = [0, -0.001, 0] as Vector3Tuple;
const GRID_SIZE = 100;
const CONTAINER_STYLE = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "#151d2c",
};
const HOUSE_INIT: House = {
  points: [
    [0, 0, 0],
    [2, 0, 0],
    [20, 0, 2],
    [0, 0, 2],
  ],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  height: 2,
};
const PIVOT_DEFAULT_PROPS = {
  autoTransform: false,
  depthTest: false,
  fixed: true,
  scale: 60,
  disableScaling: true,
  disableSliders: true,
};

/** Variables */
const pivotMatrix = new Matrix4();

/** App */
const App = () => {
  /** States */
  const [houses, setHouses] = useState<House[]>([HOUSE_INIT]);
  const [enabledCameraControls, setEnabledCameraControls] = useState(true);
  const [selectedHouseObject, setSelectedHouseObject] = useState<Object3D>();
  const [isPivotEnabled, setIsPivotEnabled] = useState(false);

  const [houseLog, setHouseLog] = useState<Object3D | null>(null);

  /** Callbacks */

  const handleOnClickHouseObject = (houseObject: Object3D) => {
    if (houseLog === houseObject) {
      setIsPivotEnabled(false);
      setHouseLog(null);
      return;
    }
    setHouseLog(houseObject);
    const houseCenter = new Vector3();
    const boundingBox = new THREE.Box3().setFromObject(houseObject);
    boundingBox.getCenter(houseCenter);

    pivotMatrix.identity();
    pivotMatrix.setPosition(houseCenter);
    setSelectedHouseObject(houseObject);

    setIsPivotEnabled(true);
  };

  useEffect(() => {
    if (!selectedHouseObject) {
      setIsPivotEnabled(false);
    }
  }, [selectedHouseObject]);

  const handleOnDragPivotControls = (matrix: Matrix4) => {
    if (!selectedHouseObject) return;

    const deltaMatrix = new Matrix4()
      .copy(matrix)
      .multiply(new Matrix4().copy(pivotMatrix).invert());

    selectedHouseObject.applyMatrix4(deltaMatrix);
    pivotMatrix.copy(matrix);

    const position = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    selectedHouseObject.matrix.decompose(position, rotation, scale);

    const eulerRotation = new Euler().setFromQuaternion(rotation);

    console.log("Updated Position:", position);
    console.log("Updated Rotation:", eulerRotation);

    setHouses((prevHouses) =>
      prevHouses.map((house) => {
        if (house === selectedHouseObject.userData.house) {
          return {
            ...house,
            position: [position.x, position.y, position.z] as Vector3Tuple,
            rotation: [
              eulerRotation.x,
              eulerRotation.y,
              eulerRotation.z,
            ] as Vector3Tuple,
          };
        }
        return house;
      })
    );
  };

  const handleOnDragEndPivotControls = () => {
    setEnabledCameraControls(true);
  };

  const handleOnDragStartPivotControls = () => {
    setEnabledCameraControls(false);
  };

  const handleOnClickGetHousesFromAPI = () => {
    fetch("https://scaffcalc.com/api/houses")
      .then((response) => response.json())
      .then((data) => {
        setHouses(data.houses);
      });
  };

  /** Return */
  return (
    <Container style={CONTAINER_STYLE}>
      <HouseTable houses={houses} />
      <Canvas camera={{ position: CAMERA_POSITION }}>
        <AxesHelper />
        <CameraControls enabled={enabledCameraControls} />
        <GridHelper position={GRID_POSITION} args={[GRID_SIZE, GRID_SIZE]} />
        <HouseManager houses={houses} onClickHouse={handleOnClickHouseObject} />
        <Light />
        <PivotControls
          {...PIVOT_DEFAULT_PROPS}
          enabled={!!selectedHouseObject}
          matrix={pivotMatrix}
          onDragStart={handleOnDragStartPivotControls}
          onDrag={handleOnDragPivotControls}
          onDragEnd={handleOnDragEndPivotControls}
        />
      </Canvas>
      <button
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          height: "40px",
          cursor: "pointer",
        }}
        onClick={handleOnClickGetHousesFromAPI}
      >
        GET Houses from API
      </button>
    </Container>
  );
};

export default App;
