import {
  ArrowForwardIos,
  ContentCopy,
  Delete,
  DynamicFeed,
  ImportExport,
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
        maxWidth: "200px",
        border: "5px solid #683AC8",
        width: "200px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#683AC8",
          width: "18px",
          height: "18px",
          top: "20px",
          left: "-12px",
          cursor: 'pointer',
          border: "2px solid #FFFFFF",
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
          sx={{ width: "14px", height: "14px", color: "#683AC8", "&:hover": { color: "#4B2A8C" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#683AC8", "&:hover": { color: "#4B2A8C" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <DynamicFeed
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#683AC8",
          }}
        />
        <div style={{ color: "#683AC8", fontSize: "16px", fontWeight: "600" }}>Menu</div>
      </div>
      <div
        style={{
          color: "#232323",
          fontSize: "12px",
          height: "50px",
          overflow: "hidden",
          marginBottom: "12px",
          lineHeight: "1.4",
        }}
      >
        {data.message}
      </div>
      {data.arrayOption.map(option => (
        <div
          key={option.number}
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "12px",
              color: "#232323",
              fontWeight: "500",
            }}
          >
            {`[${option.number}] ${option.value}`}
          </div>
          <Handle
            type="source"
            position="right"
            id={"a" + option.number}
            style={{
              top: "auto",
              background: "#683AC8",
              width: "18px",
              height: "18px",
              right: "-12px",
              cursor: 'pointer',
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
                pointerEvents: "none"
              }}
            />
          </Handle>
        </div>
      ))}
    </div>
  );
});