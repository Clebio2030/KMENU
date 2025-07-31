import {
  ArrowForwardIos,
  ContentCopy,
  Delete,
  ConfirmationNumber,
} from "@mui/icons-material";
import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Handle } from "react-flow-renderer";
import { Typography } from "@material-ui/core";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();
  console.log(12, "ticketNode", data);
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "5px",
        border: "5px solid #0872B9",
        minWidth: "200px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#0872B9",
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
            marginLeft: "2.9px",
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
          sx={{ width: "14px", height: "14px", color: "#0872B9", "&:hover": { color: "#065A9C" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#0872B9", "&:hover": { color: "#065A9C" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <ConfirmationNumber
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#0872B9",
          }}
        />
        <div style={{ color: "#0872B9", fontSize: "16px", fontWeight: "600" }}>Ticket</div>
      </div>
      <div style={{ color: "#232323", fontSize: "12px", width: "100%" }}>
        <div
          style={{
            backgroundColor: "#F6F6F6",
            marginBottom: "12px",
            borderRadius: "8px",
            padding: "8px",
            textAlign: "center",
            border: "1px solid #E0E0E0",
          }}
        >
          <div style={{ gap: "5px" }}>
            <div style={{ fontWeight: "500" }}>
              {Object.keys(data)[0] === "data" ? data.data.name : data.name}
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#0872B9",
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