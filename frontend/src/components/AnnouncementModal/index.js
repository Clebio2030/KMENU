import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TitleIcon from '@mui/icons-material/Title';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Slide from '@material-ui/core/Slide';
import { i18n } from "../../translate/i18n";
import { head } from "lodash";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl, Grid, InputLabel, MenuItem, Select, Popover, Paper, InputAdornment, Box, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import ConfirmationModal from "../ConfirmationModal";
import EmojiPicker from 'emoji-picker-react';
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  colorAdorment: {
    width: 20,
    height: 20,
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: theme.spacing(2),
    cursor: 'move',
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    overflowY: "auto",
    maxHeight: (props) => props.isSmallScreen ? "calc(100vh - 220px)" : "none",
  },
  dialogActions: {
    padding: theme.spacing(2),
    backgroundColor: "white",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
    position: "sticky",
    bottom: 0,
    zIndex: 2,
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: "20px",
    fontWeight: "bold",
    textTransform: "none",
    padding: "8px 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  attachButton: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    color: "white",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  cancelButton: {
    background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    color: "white",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  saveButton: {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    color: "white",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  emojiButton: {
    color: "#ffcc00",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  popoverContent: {
    padding: theme.spacing(2),
  },
  paper: {
    borderRadius: "12px !important",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    maxHeight: (props) => props.isSmallScreen ? "100vh" : "none",
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "white",
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
      },
    },
  },
  attachmentBox: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    marginTop: theme.spacing(1),
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  priorityIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  selectMenu: {
    "& .MuiPaper-root": {
      borderRadius: "10px",
      marginTop: theme.spacing(1),
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    },
  },
  iconAdornment: {
    color: "#667eea",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().required("Obrigatório"),
  text: Yup.string().required("Obrigatório"),
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const PriorityIcon = ({ priority }) => {
  switch (priority) {
    case 1:
      return <LowPriorityIcon style={{ color: "#ff4757" }} />;
    case 2:
      return <LowPriorityIcon style={{ color: "#ffa502" }} />;
    case 3:
      return <LowPriorityIcon style={{ color: "#2ed573" }} />;
    default:
      return <LowPriorityIcon />;
  }
};

const StatusIcon = ({ status }) => {
  return status ? 
    <ToggleOnIcon style={{ color: "#2ed573" }} /> : 
    <ToggleOffIcon style={{ color: "#ff4757" }} />;
};

const AnnouncementModal = ({ open, onClose, announcementId, reload }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles({ isSmallScreen });

  const initialState = {
    title: "",
    text: "",
    priority: 3,
    status: true,
  };

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const attachmentFile = useRef(null);
  const textFieldRef = useRef(null);

  useEffect(() => {
    try {
      (async () => {
        if (!announcementId) return;

        const { data } = await api.get(`/announcements/${announcementId}`);
        setAnnouncement((prevState) => {
          return { ...prevState, ...data };
        });
      })();
    } catch (err) {
      toastError(err);
    }
  }, [announcementId, open]);

  const handleClose = () => {
    setAnnouncement(initialState);
    setAttachment(null);
    onClose();
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveAnnouncement = async (values) => {
    const announcementData = { ...values };
    try {
      if (announcementId) {
        await api.put(`/announcements/${announcementId}`, announcementData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "announcements");
          formData.append("file", attachment);
          await api.post(
            `/announcements/${announcementId}/media-upload`,
            formData
          );
        }
      } else {
        const { data } = await api.post("/announcements", announcementData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "announcements");
          formData.append("file", attachment);

          await api.post(`/announcements/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("announcements.toasts.success"));
      if (typeof reload == "function") {
        reload();
      }
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (announcement.mediaPath) {
      await api.delete(`/announcements/${announcement.id}/media-upload`);
      setAnnouncement((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("announcements.toasts.deleted"));
      if (typeof reload == "function") {
        reload();
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const textField = textFieldRef.current;
    const cursorPosition = textField.selectionStart;
    const textBeforeCursor = textField.value.substring(0, cursorPosition);
    const textAfterCursor = textField.value.substring(cursorPosition);
    const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;

    setAnnouncement((prev) => ({
      ...prev,
      text: newText,
    }));

    setTimeout(() => {
      textField.selectionStart = cursorPosition + emojiObject.emoji.length;
      textField.selectionEnd = cursorPosition + emojiObject.emoji.length;
    }, 0);

    setEmojiPopoverOpen(false);
  };

  const handleEmojiButtonClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
    setEmojiPopoverOpen(true);
  };

  const handleEmojiPopoverClose = () => {
    setEmojiPopoverOpen(false);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("announcements.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("announcements.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        fullScreen={isSmallScreen}
        scroll="paper"
        disableBackdropClick
        disableEscapeKeyDown
        PaperComponent={PaperComponent}
        TransitionComponent={Transition}
        aria-labelledby="draggable-dialog-title"
        PaperProps={{
          className: classes.paper,
        }}
      >
        <DialogTitle id="draggable-dialog-title" className={classes.dialogTitle}>
          <Box display="flex" alignItems="center">
            <TextFieldsIcon style={{ marginRight: 8 }} />
            <Typography variant="h6">
              {announcementId
                ? `${i18n.t("announcements.dialog.edit")}`
                : `${i18n.t("announcements.dialog.add")}`}
            </Typography>
          </Box>
        </DialogTitle>
        <div style={{ display: "none" }}>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
          />
        </div>
        <Formik
          initialValues={announcement}
          enableReinitialize={true}
          validationSchema={AnnouncementSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveAnnouncement(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers className={classes.dialogContent}>
                <Grid spacing={2} container>
                  <Grid xs={12} item>
                    <Field
                      as={TextField}
                      label={i18n.t("Nome do Informativo")}
                      name="title"
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.inputField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" className={classes.iconAdornment}>
                            <TitleIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12} item>
                    <div style={{ position: "relative" }}>
                      <Field
                        as={TextField}
                        label={i18n.t("announcements.dialog.form.text")}
                        name="text"
                        error={touched.text && Boolean(errors.text)}
                        helperText={touched.text && errors.text}
                        variant="outlined"
                        margin="dense"
                        multiline={true}
                        rows={isSmallScreen ? 4 : 7}
                        fullWidth
                        className={classes.inputField}
                        inputRef={textFieldRef}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" className={classes.iconAdornment}>
                              <TextFieldsIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <IconButton
                        className={classes.emojiButton}
                        style={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                        }}
                        onClick={handleEmojiButtonClick}
                      >
                        <EmojiEmotionsIcon style={{ color: "#ffcc00" }} />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid xs={12} item>
                    <FormControl variant="outlined" margin="dense" fullWidth className={classes.inputField}>
                      <InputLabel id="status-selection-label">
                        {i18n.t("announcements.dialog.form.status")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("announcements.dialog.form.status")}
                        placeholder={i18n.t("announcements.dialog.form.status")}
                        labelId="status-selection-label"
                        id="status"
                        name="status"
                        error={touched.status && Boolean(errors.status)}
                        MenuProps={{ className: classes.selectMenu }}
                        startAdornment={
                          <InputAdornment position="start" className={classes.iconAdornment}>
                            <StatusIcon status={values.status} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value={true}>
                          {i18n.t("announcements.dialog.form.active")}
                        </MenuItem>
                        <MenuItem value={false}>
                          {i18n.t("announcements.dialog.form.inactive")}
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} item>
                    <FormControl variant="outlined" margin="dense" fullWidth className={classes.inputField}>
                      <InputLabel id="priority-selection-label">
                        {i18n.t("announcements.dialog.form.priority")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("announcements.dialog.form.priority")}
                        placeholder={i18n.t("announcements.dialog.form.priority")}
                        labelId="priority-selection-label"
                        id="priority"
                        name="priority"
                        error={touched.priority && Boolean(errors.priority)}
                        MenuProps={{ className: classes.selectMenu }}
                      >
                        <MenuItem value={1}>
                          <Box display="flex" alignItems="center">
                            <PriorityIcon priority={1} className={classes.priorityIcon} />
                            {i18n.t("announcements.dialog.form.high")}
                          </Box>
                        </MenuItem>
                        <MenuItem value={2}>
                          <Box display="flex" alignItems="center">
                            <PriorityIcon priority={2} className={classes.priorityIcon} />
                            {i18n.t("announcements.dialog.form.medium")}
                          </Box>
                        </MenuItem>
                        <MenuItem value={3}>
                          <Box display="flex" alignItems="center">
                            <PriorityIcon priority={3} className={classes.priorityIcon} />
                            {i18n.t("announcements.dialog.form.low")}
                          </Box>
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  {(announcement.mediaPath || attachment) && (
                    <Grid xs={12} item>
                      <Box className={classes.attachmentBox}>
                        <AttachFileIcon color="primary" style={{ marginRight: 8 }} />
                        <Typography variant="body2" style={{ flexGrow: 1 }}>
                          {attachment ? attachment.name : announcement.mediaName}
                        </Typography>
                        <IconButton
                          onClick={() => setConfirmationOpen(true)}
                          color="secondary"
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions className={classes.dialogActions}>
                {!attachment && !announcement.mediaPath && (
                  <Button
                    startIcon={<AttachFileIcon />}
                    style={{
                      color: "white",
                      backgroundColor: "#437db5",
                      boxShadow: "none",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                    onClick={() => attachmentFile.current.click()}
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {i18n.t("announcements.dialog.buttons.attach")}
                  </Button>
                )}
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleClose}
                  style={{
                    color: "white",
                    backgroundColor: "#db6565",
                    boxShadow: "none",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                  disabled={isSubmitting}
                  variant="contained"
                >
                  {i18n.t("announcements.dialog.buttons.cancel")}
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  type="submit"
                  style={{
                    color: "white",
                    backgroundColor: "#4ec24e",
                    boxShadow: "none",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                  disabled={isSubmitting}
                  variant="contained"
                >
                  {announcementId
                    ? `${i18n.t("announcements.dialog.buttons.edit")}`
                    : `${i18n.t("announcements.dialog.buttons.add")}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Popover
        open={emojiPopoverOpen}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiPopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={classes.popoverContent}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      </Popover>
    </div>
  );
};

export default AnnouncementModal;