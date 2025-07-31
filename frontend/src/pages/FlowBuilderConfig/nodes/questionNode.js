import {
  AccessTime,
  ArrowForwardIos,
  ContentCopy,
  Delete,
  Image,
  LibraryBooks,
  Message,
  MicNone,
  Videocam,
} from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Typography } from "@mui/material";
import BallotIcon from '@mui/icons-material/Ballot';

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "5px",
        border: "5px solid #EC5858",
        minWidth: "200px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#EC5858",
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
          sx={{ width: "14px", height: "14px", color: "#EC5858", "&:hover": { color: "#D44A4A" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#EC5858", "&:hover": { color: "#D44A4A" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <BallotIcon
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#EC5858",
          }}
        />
        <div style={{ color: "#EC5858", fontSize: "16px", fontWeight: "600" }}>Pergunta</div>
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <BallotIcon sx={{ color: "#EC5858", width: "18px", height: "18px" }} />
            </div>
            <Typography
              textAlign={"center"}
              sx={{
                textOverflow: "ellipsis",
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontWeight: "500",
              }}
            >
              {data?.typebotIntegration?.message}
            </Typography>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "#EC5858",
          width: "18px",
          height: "18px",
          top: "90%",
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