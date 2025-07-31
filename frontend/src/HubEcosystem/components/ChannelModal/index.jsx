import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { toast } from "react-toastify";

import toastError from "../../../errors/toastError";
import api from "../../../services/api";
import { i18n } from "../../../translate/i18n";
import ChannelIcon from '../ChannelIcon';
import { useStyles } from './styles';

function ChannelModal({ open, onClose }) {
  const classes = useStyles();

  const [connections, setConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);

  const handleSaveChannels = async () => {
    try {
      const data = selectedConnections.map((channel) => ({
        token: channel.id,
        name: channel.name,
        channel: channel.channel,
      }));

      await api.post(`/hub-channel`, {
        channels: data,
      });

      toast.success(i18n.t("whatsappModal.success"));
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleClose = () => {
    setSelectedConnections([]);
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const { data } = await api.get(`/hub-channel`);
        console.log(data);
        setConnections(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, [open]);

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle>Adicionar conexões</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {connections.length > 0 && (
                <>
                  <InputLabel id="demo-simple-select-label">
                    Selecionar conexões
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedConnections}
                    renderValue={(selected) =>
                      selected.map((channel) => channel.name).join(", ")
                    }
                    onChange={(e) => setSelectedConnections(e.target.value)}
                    fullWidth
                    multiple
                    variant="outlined"
                  >
                    {connections.map((connection) => (
                      <MenuItem key={connection.id} value={connection}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              marginRight: "10px",
                              backgroundColor: "#ccc",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "bold",
                            }}
                          >
                            <ChannelIcon channel={connection.channel} />
                          </div>
                        {connection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {connections.length === 0 && (
                <p>
                  Nenhum canal disponível. Para cadastrar seus canais no Hub{" "}
                  <a
                    href="https://hub.notificame.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    clique aqui
                  </a>
                  .
                </p>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="button"
            disabled={selectedConnections.length === 0}
            color="primary"
            onClick={handleSaveChannels}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChannelModal;
