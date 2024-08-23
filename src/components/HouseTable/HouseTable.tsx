import HouseManagerProps from "managers/HouseManager/HouseManager.types";
import "./HouseTable.css";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";

const HouseList = (props: HouseManagerProps) => {
  const { houses } = props;
  const [isVisible, setIsVisible] = useState(true);

  const toggleTable = () => {
    setIsVisible(!isVisible);
  };

  const getPositionWithColors = (position: [number, number, number]) => {
    const colors = ["#F92D68", "#78D89B", "#368EE2"];
    return position.map((pos, index) => (
      <span key={index} style={{ color: colors[index] }}>
        {Math.round(pos)}
        {index < position.length - 1 && (
          <span style={{ color: "#FFF" }}>, </span>
        )}
      </span>
    ));
  };

  return (
    <>
      <div className={`house-table-container ${!isVisible ? "hidden" : ""}`}>
        <div className="house-table-header">
          <h1 className="house-table-title">House Details</h1>
          <IoClose
            onClick={toggleTable}
            size={27}
            style={{ cursor: "pointer" }}
          />
        </div>
        <table className="house-table">
          <thead>
            <tr className="house-header">
              <th>House</th>
              <th>Height</th>
              <th>Position</th>
              <th>Rotation</th>
            </tr>
          </thead>
          <tbody className="house-table-items">
            {houses.map((house, index) => (
              <tr className="house-table-item" key={index}>
                <td>{index + 1}</td>
                <td>{Math.round(house.height ?? 0)}</td>
                <td>
                  [{house.position.map((pos) => Math.round(pos)).join(", ")}]
                </td>
                <td>
                  [{house.rotation.map((rot) => Math.round(rot)).join(", ")}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`arrow ${!isVisible ? "visible" : ""}`}
        onClick={toggleTable}
      >
        <IoIosArrowForward size={30} color="#FFF" />
      </div>
    </>
  );
};

export default HouseList;
