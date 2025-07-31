import {
  ArrowForwardIos,
  CallSplit,
  ContentCopy,
  Delete,
  Message,
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
        width: "200px",
        border: "5px solid #1FBADC",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#1FBADC",
          width: "18px",
          height: "18px",
          top: "20px",
          left: "-12px",
          cursor: "pointer",
          border: "2px solid #FFFFFF",
        }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      >
        <ArrowForwardIos
          sx={{
            color: "#FFFFFF",
            width: "10px",
            height: "10px",
            marginLeft: "3.5px",
            marginBottom: "1px",
            pointerEvents: "none",
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
          sx={{ width: "14px", height: "14px", color: "#1FBADC", "&:hover": { color: "#1899B6" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#1FBADC", "&:hover": { color: "#1899B6" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <CallSplit
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#1FBADC",
          }}
        />
        <div style={{ color: "#1FBADC", fontSize: "16px", fontWeight: "600" }}>Randomizador</div>
      </div>
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
          color: "#232323",
          marginBottom: "8px",
          fontWeight: "500",
        }}
      >
        {`${data.percent}%`}
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#1FBADC",
          width: "18px",
          height: "18px",
          right: "-12px",
          top: "50%",
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
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "14px",
          color: "#232323",
          marginTop: "8px",
          fontWeight: "500",
        }}
      >
        {`${100 - data.percent}%`}
      </div>
      <Handle
        type="source"
        position="right"
        id="b"
        style={{
          background: "#1FBADC",
          width: "18px",
          height: "18px",
          right: "-12px",
          top: "80%",
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