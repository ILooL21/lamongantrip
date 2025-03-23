import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: "100vh" }} // Agar loading di tengah layar penuh
      vertical>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 70, color: "#87c0cd" }}
            spin
          />
        }
      />
      <div>
        <h2
          style={{
            color: "#87c0cd",
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}>
          Loading
          <span className="ellipsis">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </h2>
      </div>
    </Flex>
  );
};

export default LoadingScreen;
