import {
  AccessTime,
  ArrowForwardIos,
  ContentCopy,
  Delete,
  Image,
  LibraryBooks,
  Message,
  MicNone,
  Videocam
} from "@mui/icons-material";
import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import { useNodeStorage } from "../../../stores/useNodeStorage";
import { Typography } from "@mui/material";

export default memo(({ data, isConnectable, id }) => {
  const storageItems = useNodeStorage();
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "5px",
        border: "5px solid #008B8B",
        minWidth: "200px",
        maxWidth: "200px", // Largura fixa para o nó
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Handle
        type="target"
        position="left"
        style={{
          background: "#008B8B",
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
          sx={{ width: "14px", height: "14px", color: "#008B8B", "&:hover": { color: "#065A9C" } }}
        />
        <Delete
          onClick={() => {
            storageItems.setNodesStorage(id);
            storageItems.setAct("delete");
          }}
          sx={{ width: "14px", height: "14px", color: "#008B8B", "&:hover": { color: "#065A9C" } }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <LibraryBooks
          sx={{
            width: "18px",
            height: "18px",
            marginRight: "8px",
            color: "#0872B9",
          }}
        />
        <div style={{ color: "#008B8B", fontSize: "16px", fontWeight: "600" }}>Conteúdo</div>
      </div>
      <div style={{ color: "#232323", fontSize: "12px", width: "100%", overflow: "hidden" }}>
        {data.seq.map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: "#F6F6F6",
              marginBottom: "12px",
              borderRadius: "8px",
              padding: "8px",
              textAlign: "center",
              border: "1px solid #E0E0E0",
              overflow: "hidden", // Garante que o conteúdo não ultrapasse o container
            }}
          >
            {item.includes("message") && (
              <div style={{ gap: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Message sx={{ color: "#0872B9", width: "16px", height: "16px" }} />
                </div>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "180px", // Limita o tamanho do texto
                  }}
                >
                  {data.elements.find((itemLoc) => itemLoc.number === item)?.value}
                </Typography>
              </div>
            )}
            {item.includes("interval") && (
              <div style={{ gap: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AccessTime sx={{ color: "#0872B9", width: "16px", height: "16px" }} />
                </div>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "180px", // Limita o tamanho do texto
                  }}
                >
                  {data.elements.find((itemLoc) => itemLoc.number === item)?.value} segundos
                </Typography>
              </div>
            )}
            {item.includes("img") && (
              <div style={{ gap: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image sx={{ color: "#0872B9", width: "16px", height: "16px" }} />
                </div>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "180px", // Limita o tamanho do texto
                  }}
                >
                  {data.elements.find((itemLoc) => itemLoc.number === item)?.original}
                </Typography>
              </div>
            )}
            {item.includes("audio") && (
              <div style={{ gap: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MicNone sx={{ color: "#0872B9", width: "16px", height: "16px" }} />
                </div>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "180px", // Limita o tamanho do texto
                  }}
                >
                  {data.elements.find((itemLoc) => itemLoc.number === item)?.original}
                </Typography>
              </div>
            )}
            {item.includes("video") && (
              <div style={{ gap: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Videocam sx={{ color: "#0872B9", width: "16px", height: "16px" }} />
                </div>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: "180px", // Limita o tamanho do texto
                  }}
                >
                  {data.elements.find((itemLoc) => itemLoc.number === item)?.original}
                </Typography>
              </div>
            )}
          </div>
        ))}
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