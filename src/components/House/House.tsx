import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Shape,
  Vector3,
} from "three";
import { useMemo, useRef, useState } from "react";
import HouseProps from "./House.types";

let currentlySelectedHouse: ((value: boolean) => void) | null = null;

const House = (props: HouseProps) => {
  const { position, rotation, points, height = 10, onClickHouse } = props;

  const [isSelected, setIsSelected] = useState(false);

  const groupRef = useRef<Group>(null);

  const handleClick = () => {
    if (currentlySelectedHouse && currentlySelectedHouse !== setIsSelected) {
      currentlySelectedHouse(false);
    }
    const newState = !isSelected;
    setIsSelected(newState);
    currentlySelectedHouse = newState ? setIsSelected : null;

    if (onClickHouse && groupRef.current) {
      onClickHouse(groupRef.current);
    }
  };

  const color = isSelected ? "#913381" : "#a43b93";
  const roofColor = isSelected ? "#a93d97" : "#d257be";

  const shape = useMemo(() => {
    const shape = new Shape();
    points.forEach((point, i) => {
      const [x, _, z] = point;
      if (i === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });

    return shape;
  }, [points]);

  const roofGeometry = useMemo(() => {
    const geometry = new BufferGeometry();

    const peak = new Vector3(
      (points[0][0] + points[1][0]) / 2,
      height * 1.5,
      (points[0][2] + points[1][2]) / 2
    );

    const vertices = [];
    for (const point of points) {
      vertices.push(point[0], height, point[2]);
    }
    vertices.push(peak.x, peak.y, peak.z);

    const indices = [0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4];

    geometry.setIndex(indices);
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    return geometry;
  }, [points, height]);

  return (
    <group
      name="HouseGroup"
      position={position}
      rotation={rotation}
      ref={groupRef}
    >
      <mesh
        name="HouseBody"
        rotation-x={Math.PI / 2}
        position-y={height}
        onClick={handleClick}
      >
        <extrudeGeometry
          attach="geometry"
          args={[shape, { depth: height, bevelEnabled: false }]}
        />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
      <mesh
        name="RoofMesh"
        geometry={roofGeometry}
        onClick={handleClick}
        position-y={height * 0}
      >
        <meshStandardMaterial
          attach="material"
          color={roofColor}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default House;
