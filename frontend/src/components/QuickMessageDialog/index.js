import React, { useContext, useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green, blue, red, grey } from "@material-ui/core/colors";
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
import { i18n } from "../../translate/i18n";
import { head } from "lodash";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import MessageVariablesPicker from "../MessageVariablesPicker";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Box,
  Avatar,
  Typography,
  Divider
} from "@material-ui/core";
import ConfirmationModal from "../ConfirmationModal";
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { Slide } from '@material-ui/core';
import {
  ShortText as ShortTextIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  InsertEmoticon as EmojiIcon,
  Code as CodeIcon
} from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const path = require('path');

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
    color: "#fff",
    padding: theme.spacing(2),
    textAlign: "left",
    cursor: 'move',
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
    },
  },
  dialogContent: {
    padding: theme.spacing(3),
    background: '#fff',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      maxHeight: 'calc(100vh - 180px)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
      maxHeight: 'calc(100vh - 160px)',
    },
  },
  dialogActions: {
    padding: theme.spacing(2),
    justifyContent: "space-between",
    background: '#fff',
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    borderTop: `1px solid ${grey[200]}`,
    position: 'sticky',
    bottom: 0,
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      gap: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
    },
  },
  textField: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      "&.Mui-focused fieldset": {
        borderColor: blue[400],
        boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
      },
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: blue[400],
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(2),
    },
  },
  buttonCancel: {
    background: `linear-gradient(135deg, ${red[500]} 0%, ${red[700]} 100%)`,
    color: "white",
    borderRadius: "8px",
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '8px 20px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    "&:hover": {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 16px',
      fontSize: '0.875rem',
    },
  },
  buttonSave: {
    background: `linear-gradient(135deg, ${green[500]} 0%, ${green[700]} 100%)`,
    color: "white",
    borderRadius: "8px",
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '8px 20px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    "&:hover": {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 16px',
      fontSize: '0.875rem',
    },
  },
  buttonAttach: {
    background: `linear-gradient(135deg, ${blue[400]} 0%, ${blue[600]} 100%)`,
    color: "white",
    borderRadius: "8px",
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '8px 20px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    "&:hover": {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 16px',
      fontSize: '0.875rem',
    },
  },
  emojiPickerContainer: {
    position: "relative",
    display: "inline-block",
  },
  emojiPicker: {
    position: "absolute",
    zIndex: 1000,
    top: "100%",
    right: 0,
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      left: 0,
      right: 'auto',
    },
  },
  emojiButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: '50%',
    transition: 'background-color 0.3s',
    "&:hover": {
      backgroundColor: grey[200],
    },
    "&:focus": {
      outline: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    }
  },
  paper: {
    borderRadius: "12px !important",
    overflow: "hidden",
    minWidth: '700px',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      minWidth: '90%',
      maxWidth: '90%',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      margin: theme.spacing(0.5),
      maxHeight: '95vh',
    },
  },
  headerIcon: {
    background: 'rgba(255,255,255,0.2)',
    padding: theme.spacing(1),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(1),
      padding: theme.spacing(0.75),
      width: 32,
      height: 32,
    },
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    color: grey[800],
    fontWeight: 600,
    fontSize: '1rem',
    "& svg": {
      marginRight: theme.spacing(1.5),
      color: blue[500],
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.85rem',
      marginBottom: theme.spacing(1.5),
    }
  },
  attachmentBox: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3),
    border: `1px solid ${grey[200]}`,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5),
      marginBottom: theme.spacing(2),
    },
  },
  attachmentIcon: {
    background: blue[50],
    color: blue[500],
    marginRight: theme.spacing(2),
    width: 40,
    height: 40,
    [theme.breakpoints.down('xs')]: {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1.5),
    },
  },
  variableButton: {
    background: grey[100],
    color: grey[800],
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.2s',
    "&:hover": {
      background: grey[200],
    },
    "& svg": {
      marginRight: '6px',
      fontSize: '16px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '4px 8px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '11px',
      padding: '3px 6px',
      marginRight: theme.spacing(0.75),
      marginBottom: theme.spacing(0.75),
    }
  },
  divider: {
    margin: theme.spacing(3, 0),
    background: grey[200],
    height: 2,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 0),
    },
  },
  inputIcon: {
    color: grey[500],
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
    },
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
  formGridContainer: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  messageInputContainer: {
    position: 'relative',
  },
  messageCounter: {
    position: 'absolute',
    right: theme.spacing(1),
    bottom: theme.spacing(-3),
    color: grey[500],
    fontSize: '0.75rem',
    background: 'transparent',
    padding: theme.spacing(0.25, 1),
    borderRadius: '4px',
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(-2.5),
      fontSize: '0.7rem',
    },
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gap: theme.spacing(2),
    },
  },
  mobileToolbar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  mobileActionButtons: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  scrollableContent: {
    overflowY: 'auto',
    flex: 1,
  },
  stickyFooter: {
    position: 'sticky',
    bottom: 0,
    background: '#fff',
    zIndex: 1,
    borderTop: `1px solid ${grey[200]}`,
  },
}));

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} style={{ borderRadius: "12px", overflow: "hidden" }} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QuickMessageSchema = Yup.object().shape({
  shortcode: Yup.string().required("Obrigatório"),
});

const QuickMessageDialog = ({ open, onClose, quickemessageId, reload }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const messageInputRef = useRef();
  const emojiPickerRef = useRef();
  const emojiButtonRef = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const initialState = {
    shortcode: "",
    message: "",
    geral: false,
    status: true,
  };

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [quickemessage, setQuickemessage] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);

  useEffect(() => {
    try {
      (async () => {
        if (!quickemessageId) return;

        const { data } = await api.get(`/quick-messages/${quickemessageId}`);

        setQuickemessage((prevState) => {
          return { ...prevState, ...data };
        });
      })();
    } catch (err) {
      toastError(err);
    }
  }, [quickemessageId, open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && 
          !emojiPickerRef.current.contains(event.target) &&
          !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setQuickemessage(initialState);
    setAttachment(null);
    onClose();
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveQuickMessage = async (values) => {
    const quickemessageData = {
      ...values,
      isMedia: true,
      mediaPath: attachment
        ? String(attachment.name).replace(/ /g, "_")
        : values.mediaPath
        ? path.basename(values.mediaPath).replace(/ /g, "_")
        : null,
    };

    try {
      if (quickemessageId) {
        await api.put(`/quick-messages/${quickemessageId}`, quickemessageData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "quickMessage");
          formData.append("file", attachment);
          await api.post(
            `/quick-messages/${quickemessageId}/media-upload`,
            formData
          );
        }
      } else {
        const { data } = await api.post("/quick-messages", quickemessageData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "quickMessage");
          formData.append("file", attachment);
          await api.post(`/quick-messages/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("quickMessages.toasts.success"));
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

    if (quickemessage.mediaPath) {
      await api.delete(`/quick-messages/${quickemessage.id}/media-upload`);
      setQuickemessage((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("quickMessages.toasts.deleted"));
      if (typeof reload == "function") {
        reload();
      }
    }
  };

  const handleClickMsgVar = async (msgVar, setValueFunc) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + msgVar.length;

    setValueFunc("message", `${firstHalfText}${msgVar}${secondHalfText}`);

    await new Promise((r) => setTimeout(r, 100));
    messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
  };

  const handleEmojiSelect = (emoji, setFieldValue) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + emoji.native.length;

    setFieldValue("message", `${firstHalfText}${emoji.native}${secondHalfText}`);

    setTimeout(() => {
      messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("quickMessages.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("quickMessages.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperComponent={PaperComponent}
        TransitionComponent={Transition}
        aria-labelledby="draggable-dialog-title"
        disableBackdropClick
        disableEscapeKeyDown
        PaperProps={{
          className: classes.paper,
        }}
      >
        <DialogTitle className={classes.dialogTitle} id="draggable-dialog-title">
          <div className={classes.titleContainer}>
            <Avatar className={classes.headerIcon}>
              <MessageIcon />
            </Avatar>
            <Typography variant="h6" style={{ fontWeight: 700 }}>
              {quickemessageId
                ? `${i18n.t("quickMessages.dialog.edit")}`
                : `${i18n.t("quickMessages.dialog.add")}`}
            </Typography>
          </div>
        </DialogTitle>
        <div style={{ display: "none" }}>
          <input
            type="file"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
          />
        </div>
        <Formik
          initialValues={quickemessage}
          enableReinitialize={true}
          validationSchema={QuickMessageSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQuickMessage(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogContent dividers className={classes.dialogContent}>
                <Grid container spacing={isXs ? 1 : 3} className={classes.formGridContainer}>
                  {/* First Row - Shortcode */}
                  <Grid item xs={12}>
                    <Typography className={classes.sectionTitle}>
                      <ShortTextIcon /> {i18n.t("quickMessages.dialog.shortcode")}
                    </Typography>
                    <Field
                      as={TextField}
                      autoFocus
                      name="shortcode"
                      disabled={
                        quickemessageId &&
                        values.visao &&
                        !values.geral &&
                        values.userId !== user.id
                      }
                      error={touched.shortcode && Boolean(errors.shortcode)}
                      helperText={touched.shortcode && errors.shortcode}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.textField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShortTextIcon className={classes.inputIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Divider className={classes.divider} />
                  
                  {/* Message Section */}
                  <Grid item xs={12}>
                    <Typography className={classes.sectionTitle}>
                      <MessageIcon /> {i18n.t("quickMessages.dialog.message")}
                    </Typography>
                    <div className={classes.messageInputContainer}>
                      <Field
                        as={TextField}
                        name="message"
                        inputRef={messageInputRef}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        variant="outlined"
                        margin="dense"
                        disabled={
                          quickemessageId &&
                          values.visao &&
                          !values.geral &&
                          values.userId !== user.id
                        }
                        multiline={true}
                        rows={isMobile ? 4 : 8}
                        fullWidth
                        className={classes.textField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <div className={classes.emojiPickerContainer}>
                                <IconButton
                                  ref={emojiButtonRef}
                                  className={classes.emojiButton}
                                  onClick={toggleEmojiPicker}
                                  disabled={
                                    quickemessageId &&
                                    values.visao &&
                                    !values.geral &&
                                    values.userId !== user.id
                                  }
                                >
                                  <EmojiIcon />
                                </IconButton>
                                {showEmojiPicker && (
                                  <div 
                                    ref={emojiPickerRef} 
                                    className={classes.emojiPicker}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Picker
                                      onSelect={(emoji) => handleEmojiSelect(emoji, setFieldValue)}
                                      title="Selecione um emoji"
                                      emojiSize={20}
                                      perLine={isXs ? 6 : 8}
                                    />
                                  </div>
                                )}
                              </div>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <div className={classes.messageCounter}>
                        {values.message ? values.message.length : 0}/1024
                      </div>
                    </div>
                  </Grid>
                  
                  {/* Variables Section */}
                  <Grid item xs={12}>
                    <Box display="flex" flexWrap="wrap" mt={1} mb={2}>
                      <Typography variant="caption" style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
                        <CodeIcon style={{ fontSize: 16, marginRight: 4 }} /> Variáveis disponíveis:
                      </Typography>
                      <MessageVariablesPicker
                        disabled={
                          isSubmitting ||
                          (quickemessageId &&
                            values.visao &&
                            !values.geral &&
                            values.userId !== user.id)
                        }
                        onClick={(value) => handleClickMsgVar(value, setFieldValue)}
                        buttonClass={classes.variableButton}
                      />
                    </Box>
                  </Grid>
                  
                  <Divider className={classes.divider} />
                  
                  {/* Settings Section */}
                  <Grid item xs={12}>
                    <Typography className={classes.sectionTitle}>
                      <VisibilityIcon /> Configurações de Visibilidade
                    </Typography>
                    
                    <div className={classes.twoColumnGrid}>
                      <FormControl variant="outlined" margin="dense" fullWidth>
                        <Field
                          as={TextField}
                          select
                          label={i18n.t("quickMessages.dialog.visao")}
                          name="visao"
                          disabled={
                            quickemessageId &&
                            values.visao &&
                            !values.geral &&
                            values.userId !== user.id
                          }
                          error={touched.visao && Boolean(errors.visao)}
                          value={values.visao ? "true" : "false"}
                          onChange={(e) => {
                            setFieldValue("visao", e.target.value === "true");
                          }}
                          variant="outlined"
                          className={classes.textField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VisibilityIcon className={classes.inputIcon} />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value={"true"}>{i18n.t("announcements.active")}</MenuItem>
                          <MenuItem value={"false"}>{i18n.t("announcements.inactive")}</MenuItem>
                        </Field>
                      </FormControl>
                      
                      {values.visao === true && (
                        <FormControl variant="outlined" margin="dense" fullWidth>
                          <Field
                            as={TextField}
                            select
                            label={i18n.t("quickMessages.dialog.geral")}
                            name="geral"
                            disabled={
                              quickemessageId &&
                              values.visao &&
                              !values.geral &&
                              values.userId !== user.id
                            }
                            value={values.geral ? "true" : "false"}
                            error={touched.geral && Boolean(errors.geral)}
                            variant="outlined"
                            className={classes.textField}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PublicIcon className={classes.inputIcon} />
                                </InputAdornment>
                              ),
                            }}
                          >
                            <MenuItem value={"true"}>{i18n.t("announcements.active")}</MenuItem>
                            <MenuItem value={"false"}>{i18n.t("announcements.inactive")}</MenuItem>
                          </Field>
                        </FormControl>
                      )}
                    </div>
                  </Grid>
                  
                  {/* Attachment Section */}
                  {(quickemessage.mediaPath || attachment) && (
                    <Grid item xs={12}>
                      <Box className={classes.attachmentBox}>
                        <Avatar className={classes.attachmentIcon}>
                          <AttachFileIcon />
                        </Avatar>
                        <Typography variant="body2" style={{ flex: 1 }}>
                          {attachment ? attachment.name : quickemessage.mediaName}
                        </Typography>
                        <IconButton
                          onClick={() => setConfirmationOpen(true)}
                          disabled={
                            quickemessageId &&
                            values.visao &&
                            !values.geral &&
                            values.userId !== user.id
                          }
                          size="small"
                        >
                          <DeleteOutlineIcon color="secondary" />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <div className={classes.stickyFooter}>
                <DialogActions className={classes.dialogActions}>
                  <Box>
                    {!attachment && !quickemessage.mediaPath && (
                      <Button
                        style={{
                          color: "white",
                          backgroundColor: "#437db5",
                          boxShadow: "none",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                        onClick={() => attachmentFile.current.click()}
                        disabled={
                          isSubmitting ||
                          (quickemessageId &&
                            values.visao &&
                            !values.geral &&
                            values.userId !== user.id)
                        }
                        startIcon={<AttachFileIcon />}
                        className={isMobile ? classes.buttonAttach : ''}
                      >
                        {i18n.t("quickMessages.buttons.attach")}
                      </Button>
                    )}
                  </Box>
                  <Box className={classes.actionButtonsContainer}>
                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#db6565",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                      onClick={handleClose}
                      disabled={isSubmitting}
                      startIcon={<CancelIcon />}
                      className={isMobile ? classes.buttonCancel : ''}
                    >
                      {i18n.t("quickMessages.buttons.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      style={{
                        color: "white",
                        backgroundColor: "#4ec24e",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                      disabled={
                        isSubmitting ||
                        (quickemessageId &&
                          values.visao &&
                          !values.geral &&
                          values.userId !== user.id)
                      }
                      startIcon={<SaveIcon />}
                      className={isMobile ? classes.buttonSave : ''}
                    >
                      {quickemessageId
                        ? `${i18n.t("quickMessages.buttons.edit")}`
                        : `${i18n.t("quickMessages.buttons.add")}`}
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </Button>
                  </Box>
                </DialogActions>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default QuickMessageDialog;