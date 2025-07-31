import {
  AccessTime,
  ArrowForwardIos,
  ContentCopy,
  Delete,
  Message
} from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "5px",
        minWidth: "180px",
        border: "5px solid #F7953B",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#F7953B",
          width: "18px",
          height: "18px",
          top: "20px",
          left: "-12px",
          cursor: 'pointer',
          border: "2px solid #F7953B",
        }}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      >
        <ArrowForwardIos
          sx={{
            color: "#FFFFFF",
            width: "10px",
            height: "10px",
            marginLeft: "3.5px",
            marginBottom: "1px",
            pointerEvents: "none"
          }}
        />
      </Handle>
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "12px",
          top: "12px",
          cursor: "pointer",
          gap: "8px",
        }}
      >
        <ContentCopy
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("duplicate");
          }}
          sx={{ width: "14px", height: "14px", color: "#F7953B", "&:hover": { color: "#D97E2E" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#F7953B", "&:hover": { color: "#D97E2E" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <AccessTime
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#F7953B",
          }}
        />
        <div style={{ color: "#F7953B", fontSize: "16px", fontWeight: "600" }}>Intervalo</div>
      </div>
      <div
        style={{
          color: "#232323",
          fontSize: "12px",
          marginBottom: "12px",
          lineHeight: "1.4",
        }}
      >
        {data.sec} segundos
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#F7953B",
          width: "18px",
          height: "18px",
          top: "70%",
          right: "-12px",
          cursor: 'pointer',
          border: "2px solid #F7953B",
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
            pointerEvents: "none"
          }}
        />
      </Handle>
    </div>
  );
});