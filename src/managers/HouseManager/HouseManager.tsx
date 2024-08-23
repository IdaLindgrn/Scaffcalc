import House from "../../components/House";
import HouseManagerProps from "./HouseManager.types";

const HouseManager = (props: HouseManagerProps) => {
  const { houses, onClickHouse } = props;

  return (
    <group name="Houses">
      {houses.map((house, index) => (
        <House key={index} {...house} onClickHouse={onClickHouse} />
      ))}
    </group>
  );
};

export default HouseManager;
