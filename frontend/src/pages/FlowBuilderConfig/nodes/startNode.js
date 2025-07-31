import { ArrowForwardIos, Message, RocketLaunch } from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "5px",
        border: "5px solid #3ABA38",
        minWidth: "200px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <RocketLaunch
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#3ABA38",
          }}
        />
        <div style={{ color: "#3ABA38", fontSize: "16px", fontWeight: "600" }}>
          Início do Fluxo
        </div>
      </div>
      <div style={{ color: "#727272", fontSize: "12px", lineHeight: "1.4" }}>
        Este bloco marca o início do seu fluxo!
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#3ABA38",
          width: "18px",
          height: "18px",
          top: "70%",
          right: "-12px",
          cursor: "pointer",
          border: "2px solid #FFFFFF",
        }}
        isConnectable={isConnectable}
      >
        <ArrowForwardIos
          sx={{
            color: "#FFFFFF",
            width: "10px",
            height: "10px",
            marginLeft: "2.9px",
            marginBottom: "1px",
            pointerEvents: "none",
          }}
        />
      </Handle>
    </div>
  );
});