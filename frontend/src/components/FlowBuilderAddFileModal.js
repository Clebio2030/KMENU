import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import api from "../services/api";

const FlowBuilderAddFileModal = ({ open, onSave, onUpdate, data, close }) => {
  const [label, setLabel] = useState(data?.label || "");
  const [file, setFile] = useState(data?.file || null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(data?.url || "");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return null;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/flowbuilder/content", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileUrl(data.url);
      toast.success("Arquivo enviado com sucesso!");
      return data.url;
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      toast.error("Erro ao enviar arquivo. Tente novamente.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!file && !fileUrl) {
      toast.error("Selecione um arquivo!");
      return;
    }

    let url = fileUrl;

    // Se tiver um novo arquivo, faz o upload
    if (file && !fileUrl) {
      url = await uploadFile();
      if (!url) return; // Se falhou o upload, não continua
    }

    if (data) {
      onUpdate({ ...data, label, url }); // Atualiza o nó existente
    } else {
      onSave({ label, url }); // Cria um novo nó
    }

    close();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Adicionar Nó de Arquivo</DialogTitle>
      <DialogContent>
        {/* Campo para inserir o rótulo */}
        <TextField
          autoFocus
          margin="dense"
          label="Rótulo"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Campo para selecionar o arquivo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px dashed #ccc",
            borderRadius: "4px",
            padding: "16px",
            marginBottom: "16px",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#0872B9",
            },
          }}
        >
          <Input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <CloudUploadIcon sx={{ color: "#0872B9", fontSize: "40px" }} />
            <Typography
              variant="body1"
              sx={{ color: "#0872B9", marginTop: "8px" }}
            >
              {file
                ? file.name
                : fileUrl
                ? "Arquivo já carregado"
                : "Escolha um arquivo"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", marginTop: "4px" }}
            >
              {file || fileUrl
                ? "Arquivo selecionado"
                : "Clique para selecionar um arquivo"}
            </Typography>
          </label>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button
          onClick={handleSave}
          disabled={!label || (!file && !fileUrl) || uploading}
        >
          {uploading ? <CircularProgress size={24} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowBuilderAddFileModal;
