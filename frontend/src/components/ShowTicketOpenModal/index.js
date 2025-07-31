import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { i18n } from '../../translate/i18n';
import CancelIcon from '@mui/icons-material/Cancel';

const ShowTicketOpen = ({ isOpen, handleClose, user, queue }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{i18n.t("showTicketOpenModal.title.header")}</DialogTitle>
      <DialogContent>
        {user !== undefined && queue !== undefined && (
          <DialogContentText>
            {i18n.t("showTicketOpenModal.form.message")} <br></br>
            { `${i18n.t("showTicketOpenModal.form.user")}: ${user}`}<br></br>
            {`${i18n.t("showTicketOpenModal.form.queue")}: ${queue}`}<br></br>
          </DialogContentText>
        )}
        {!user && (
          <DialogContentText>
            {i18n.t("showTicketOpenModal.form.messageWait")} <br></br>
            {queue && (`${i18n.t("showTicketOpenModal.form.queue")}: ${queue}`)}<br></br>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CancelIcon />}
          onClick={handleClose}
	  style={{
          color: "white",
          backgroundColor: "#db6565",
          boxShadow: "none",
          borderRadius: 0,
          fontSize: "12px",
          }}
           >
          Fechar
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default ShowTicketOpen;
