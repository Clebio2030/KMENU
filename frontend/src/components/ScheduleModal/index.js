import React, { useState, useEffect, useContext, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { green, orange, blue, red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { Chip, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, Typography } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import AttachFile from "@material-ui/icons/AttachFile";
import { head } from "lodash";
import ConfirmationModal from "../ConfirmationModal";
import MessageVariablesPicker from "../MessageVariablesPicker";
import useQueues from "../../hooks/useQueues";
import UserStatusIcon from "../UserModal/statusIcon";
import { Facebook, Instagram, WhatsApp } from "@material-ui/icons";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import Draggable from 'react-draggable';

// Ícones adicionais para os campos
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RepeatIcon from '@mui/icons-material/Repeat';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "16px 24px",
    fontSize: "1.25rem",
    fontWeight: 500,
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
  dialogContent: {
    backgroundColor: "#fafafa",
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  gridContainer: {
    marginTop: theme.spacing(2),
  },
  buttonWrapper: {
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
  attachmentButton: {
    marginRight: theme.spacing(2),
  },
  recurrenceSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: "white",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    borderLeft: `4px solid ${blue[500]}`,
  },
  emojiPickerContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  emojiPicker: {
    position: 'absolute',
    right: 0,
    bottom: '100%',
    zIndex: 1000,
  },
  dialogActions: {
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldIcon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
  inputWithIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  customButton: {
    borderRadius: '4px',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
  },
  attachmentPreview: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    marginTop: theme.spacing(1),
  },
  actionButtonsContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    marginLeft: theme.spacing(2),
  }
}));

const ScheduleSchema = Yup.object().shape({
  body: Yup.string()
    .min(5, "Mensagem muito curta")
    .required("Obrigatório"),
  contactId: Yup.number().required("Obrigatório"),
  sendAt: Yup.string().required("Obrigatório"),
});

const ScheduleModal = ({ open, onClose, scheduleId, contactId, cleanContact, reload }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const isMounted = useRef(true);
  const { companyId } = user;

  const initialState = {
    body: "",
    contactId: "",
    sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
    sentAt: "",
    openTicket: "enabled",
    ticketUserId: "",
    queueId: "",
    statusTicket: "closed",
    intervalo: 1,
    valorIntervalo: 0,
    enviarQuantasVezes: 1,
    tipoDias: 4,
    assinar: false,
  };

  const initialContact = {
    id: "",
    name: "",
    channel: "",
  };

  const [schedule, setSchedule] = useState(initialState);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [contacts, setContacts] = useState([initialContact]);
  const [intervalo, setIntervalo] = useState(1);
  const [tipoDias, setTipoDias] = useState(4);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const messageInputRef = useRef();
  const [channelFilter, setChannelFilter] = useState("whatsapp");
  const [whatsapps, setWhatsapps] = useState([]);
  const [selectedWhatsapps, setSelectedWhatsapps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queues, setQueues] = useState([]);
  const [allQueues, setAllQueues] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const { findAll: findAllQueues } = useQueues();
  const [options, setOptions] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      const loadQueues = async () => {
        const list = await findAllQueues();
        setAllQueues(list);
        setQueues(list);
      };
      loadQueues();
    }
  }, []);

  useEffect(() => {
    if (searchParam.length < 3) {
      setLoading(false);
      setSelectedQueue("");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/");
          setOptions(data.users);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);

  useEffect(() => {
    api
      .get(`/whatsapp/filter`, { params: { session: 0, channel: channelFilter } })
      .then(({ data }) => {
        const mappedWhatsapps = data.map((whatsapp) => ({
          ...whatsapp,
          selected: false,
        }));
        setWhatsapps(mappedWhatsapps);
        if (mappedWhatsapps.length && mappedWhatsapps?.length === 1) {
          setSelectedWhatsapps(mappedWhatsapps[0].id);
        }
      });
  }, [currentContact, channelFilter]);

  useEffect(() => {
    if (contactId && contacts.length) {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    const { companyId } = user;
    if (open) {
      try {
        (async () => {
          const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
          let customList = contactList.map((c) => ({ id: c.id, name: c.name, channel: c.channel }));
          if (isArray(customList)) {
            setContacts([{ id: "", name: "", channel: "" }, ...customList]);
          }
          if (contactId) {
            setSchedule((prevState) => ({ ...prevState, contactId }));
          }

          if (!scheduleId) return;

          const { data } = await api.get(`/schedules/${scheduleId}`);
          setSchedule((prevState) => ({ ...prevState, ...data, sendAt: moment(data.sendAt).format('YYYY-MM-DDTHH:mm') }));
          if (data.whatsapp) {
            setSelectedWhatsapps(data.whatsapp.id);
          }
          if (data.ticketUser) {
            setSelectedUser(data.ticketUser);
          }
          if (data.queueId) {
            setSelectedQueue(data.queueId);
          }
          if (data.intervalo) {
            setIntervalo(data.intervalo);
          }
          if (data.tipoDias) {
            setTipoDias(data.tipoDias);
          }
          setCurrentContact(data.contact);
        })();
      } catch (err) {
        toastError(err);
      }
    }
  }, [scheduleId, contactId, open, user]);

  const filterOptions = createFilterOptions({
    trim: true,
  });

  const handleClose = () => {
    onClose();
    setAttachment(null);
    setSchedule(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const IconChannel = (channel) => {
    switch (channel) {
      case "facebook":
        return <Facebook style={{ color: "#3b5998", verticalAlign: "middle" }} />;
      case "instagram":
        return <Instagram style={{ color: "#e1306c", verticalAlign: "middle" }} />;
      case "whatsapp":
        return <WhatsApp style={{ color: "#25d366", verticalAlign: "middle" }} />;
      default:
        return "error";
    }
  };

  const renderOption = (option) => {
    if (option.name) {
      return (
        <>
          {IconChannel(option.channel)}
          <Typography component="span" style={{ fontSize: 14, marginLeft: "10px", display: "inline-flex", alignItems: "center", lineHeight: "2" }}>
            {option.name}
          </Typography>
        </>
      );
    } else {
      return `${i18n.t("newTicketModal.add")} ${option.name}`;
    }
  };

  const handleSaveSchedule = async (values) => {
    const scheduleData = {
      ...values,
      userId: user.id,
      whatsappId: selectedWhatsapps,
      ticketUserId: selectedUser?.id || null,
      queueId: selectedQueue || null,
      intervalo: intervalo || 1,
      tipoDias: tipoDias || 4,
    };

    try {
      if (scheduleId) {
        await api.put(`/schedules/${scheduleId}`, scheduleData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/schedules/${scheduleId}/media-upload`, formData);
        }
      } else {
        const { data } = await api.post("/schedules", scheduleData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/schedules/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("scheduleModal.success"));
      if (typeof reload === 'function') {
        reload();
      }
      if (contactId) {
        if (typeof cleanContact === 'function') {
          cleanContact();
          history.push('/schedules');
        }
      }
      window.location.reload();
    } catch (err) {
      toastError(err);
    }
    setCurrentContact(initialContact);
    setSchedule(initialState);
    handleClose();
  };

  const handleClickMsgVar = async (msgVar, setValueFunc) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + msgVar.length;

    setValueFunc("body", `${firstHalfText}${msgVar}${secondHalfText}`);

    await new Promise((r) => setTimeout(r, 100));
    messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (schedule.mediaPath) {
      await api.delete(`/schedules/${schedule.id}/media-upload`);
      setSchedule((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("scheduleModal.toasts.deleted"));
      if (typeof reload === "function") {
        reload();
      }
    }
  };

  const handleEmojiSelect = (emoji, setFieldValue, values) => {
    const el = messageInputRef.current;
    const currentValue = values.body || "";
    const selectionStart = el.selectionStart;
    const selectionEnd = el.selectionEnd;
    
    const newValue = 
      currentValue.substring(0, selectionStart) + 
      emoji.native + 
      currentValue.substring(selectionEnd);
    
    setFieldValue("body", newValue);
    
    // Foca no campo e posiciona o cursor após o emoji inserido
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(selectionStart + emoji.native.length, selectionStart + emoji.native.length);
    }, 0);
    
    setShowEmojiPicker(false);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("scheduleModal.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("scheduleModal.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        disableBackdropClick
        disableEscapeKeyDown
        PaperProps={{
          style: {
            borderRadius: 12,
          },
        }}
        PaperComponent={(props) => (
          <Draggable handle=".drag-handle" cancel={'[class*="MuiDialogContent-root"]'}>
            <div {...props} />
          </Draggable>
        )}
      >
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
          <div className="drag-handle" style={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon />
            {schedule.status === 'ERRO' ? 'Erro de Envio' : `Mensagem ${capitalize(schedule.status)}`}
          </div>
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
          initialValues={schedule}
          enableReinitialize={true}
          validationSchema={ScheduleSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSchedule(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form>
              <DialogContent dividers className={classes.dialogContent}>
                <Grid container spacing={3} className={classes.gridContainer}>
                  {/* Seção de Contato e Mensagem */}
                  <Grid item xs={12}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                      <ContactMailIcon />
                      Informações Básicas
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div className={classes.inputWithIcon}>
                          <ContactMailIcon className={classes.fieldIcon} />
                          <FormControl variant="outlined" fullWidth>
                            <Autocomplete
                              fullWidth
                              value={currentContact}
                              options={contacts}
                              onChange={(e, contact) => {
                                const contactId = contact ? contact.id : '';
                                setSchedule({ ...schedule, contactId });
                                setCurrentContact(contact ? contact : initialContact);
                                setChannelFilter(contact ? contact.channel : "whatsapp");
                              }}
                              getOptionLabel={(option) => option.name}
                              renderOption={renderOption}
                              getOptionSelected={(option, value) => value.id === option.id}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  variant="outlined" 
                                  placeholder="Selecione um contato" 
                                  label="Contato"
                                />
                              )}
                            />
                          </FormControl>
                        </div>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <div className={classes.inputWithIcon}>
                          <MessageIcon className={classes.fieldIcon} />
                          <Field
                            as={TextField}
                            rows={6}
                            multiline={true}
                            label={i18n.t("scheduleModal.form.body")}
                            name="body"
                            inputRef={messageInputRef}
                            error={touched.body && Boolean(errors.body)}
                            helperText={touched.body && errors.body}
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <div className={classes.emojiPickerContainer}>
                                  <IconButton
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    size="small"
                                  >
                                    <InsertEmoticonIcon />
                                  </IconButton>
                                  {showEmojiPicker && (
                                    <div className={classes.emojiPicker}>
                                      <Picker
                                        onSelect={(emoji) => handleEmojiSelect(emoji, setFieldValue, values)}
                                        title="Selecione um emoji"
                                        emojiSize={20}
                                        perLine={8}
                                      />
                                    </div>
                                  )}
                                </div>
                              ),
                            }}
                          />
                        </div>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <MessageVariablesPicker
                          disabled={isSubmitting}
                          onClick={(value) => handleClickMsgVar(value, setFieldValue)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Seção de Configurações */}
                  <Grid item xs={12}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                      <SettingsIcon />
                      Configurações de Envio
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <div className={classes.inputWithIcon}>
                          <SmartphoneIcon className={classes.fieldIcon} />
                          <FormControl variant="outlined" margin="dense" fullWidth>
                            <InputLabel id="whatsapp-selection-label">
                              Conexão
                            </InputLabel>
                            <Field
                              as={Select}
                              label="Conexão"
                              placeholder="Conexão"
                              labelId="whatsapp-selection-label"
                              id="whatsappIds"
                              name="whatsappIds"
                              required
                              error={touched.whatsappId && Boolean(errors.whatsappId)}
                              value={selectedWhatsapps}
                              onChange={(event) => setSelectedWhatsapps(event.target.value)}
                            >
                              {whatsapps.map((whatsapp) => (
                                <MenuItem key={whatsapp.id} value={whatsapp.id}>
                                  {whatsapp.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </div>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <div className={classes.inputWithIcon}>
                          <TicketIcon className={classes.fieldIcon} />
                          <FormControl variant="outlined" margin="dense" fullWidth>
                            <InputLabel id="openTicket-selection-label">
                              Criar Ticket
                            </InputLabel>
                            <Field
                              as={Select}
                              label="Criar Ticket"
                              placeholder="Criar Ticket"
                              labelId="openTicket-selection-label"
                              id="openTicket"
                              name="openTicket"
                              error={touched.openTicket && Boolean(errors.openTicket)}
                            >
                              <MenuItem value={"enabled"}>Ativar</MenuItem>
                              <MenuItem value={"disabled"}>Desativar</MenuItem>
                            </Field>
                          </FormControl>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Seção de Atribuição */}
                  {values.openTicket === "enabled" && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" style={{ marginBottom: '16px', color: '#555' }}>
                        Configurações do Ticket
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <div className={classes.inputWithIcon}>
                            <PersonIcon className={classes.fieldIcon} />
                            <Autocomplete
                              variant="outlined"
                              margin="dense"
                              getOptionLabel={(option) => `${option.name}`}
                              value={selectedUser}
                              size="small"
                              onChange={(e, newValue) => {
                                setSelectedUser(newValue);
                                if (newValue != null && Array.isArray(newValue.queues)) {
                                  if (newValue.queues.length === 1) {
                                    setSelectedQueue(newValue.queues[0].id);
                                  }
                                  setQueues(newValue.queues);
                                } else {
                                  setQueues(allQueues);
                                  setSelectedQueue("");
                                }
                              }}
                              options={options}
                              filterOptions={filterOptions}
                              freeSolo
                              fullWidth
                              autoHighlight
                              noOptionsText={i18n.t("transferTicketModal.noOptions")}
                              loading={loading}
                              renderOption={(option) => (
                                <span>
                                  <UserStatusIcon user={option} /> {option.name}
                                </span>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Atribuir a"
                                  variant="outlined"
                                  onChange={(e) => setSearchParam(e.target.value)}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {loading ? (
                                          <CircularProgress color="inherit" size={20} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <div className={classes.inputWithIcon}>
                            <GroupIcon className={classes.fieldIcon} />
                            <FormControl variant="outlined" margin="dense" fullWidth>
                              <InputLabel>Fila</InputLabel>
                              <Select
                                value={selectedQueue}
                                onChange={(e) => setSelectedQueue(e.target.value)}
                                label="Fila"
                              >
                                {queues.map((queue) => (
                                  <MenuItem key={queue.id} value={queue.id}>
                                    {queue.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <div className={classes.inputWithIcon}>
                            <TicketIcon className={classes.fieldIcon} />
                            <FormControl variant="outlined" margin="dense" fullWidth>
                              <InputLabel id="statusTicket-selection-label">
                                Status do Ticket
                              </InputLabel>
                              <Field
                                as={Select}
                                label="Status do Ticket"
                                placeholder="Status do Ticket"
                                labelId="statusTicket-selection-label"
                                id="statusTicket"
                                name="statusTicket"
                                error={touched.statusTicket && Boolean(errors.statusTicket)}
                              >
                                <MenuItem value={"closed"}>Fechado</MenuItem>
                                <MenuItem value={"open"}>Aberto</MenuItem>
                              </Field>
                            </FormControl>
                          </div>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <div className={classes.inputWithIcon}>
                            <CalendarTodayIcon className={classes.fieldIcon} />
                            <Field
                              as={TextField}
                              label={i18n.t("scheduleModal.form.sendAt")}
                              type="datetime-local"
                              name="sendAt"
                              error={touched.sendAt && Boolean(errors.sendAt)}
                              helperText={touched.sendAt && errors.sendAt}
                              variant="outlined"
                              fullWidth
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </div>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Field
                                as={Switch}
                                color="primary"
                                name="assinar"
                                checked={values.assinar}
                              />
                            }
                            label="Assinar mensagem"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  {/* Seção de Recorrência */}
                  <Grid item xs={12} className={classes.recurrenceSection}>
                    <Typography variant="h6" className={classes.sectionTitle}>
                      <RepeatIcon />
                      Configurações de Recorrência
                    </Typography>
                    <Typography variant="body2" paragraph style={{ color: '#666' }}>
                      Defina como a mensagem será enviada de forma recorrente. Deixe em branco para envio único.
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <div className={classes.inputWithIcon}>
                          <RepeatIcon className={classes.fieldIcon} />
                          <FormControl size="small" fullWidth variant="outlined">
                            <InputLabel>Intervalo</InputLabel>
                            <Select
                              value={intervalo}
                              onChange={(e) => setIntervalo(e.target.value || 1)}
                              label="Intervalo"
                            >
                              <MenuItem value={1}>Dias</MenuItem>
                              <MenuItem value={2}>Semanas</MenuItem>
                              <MenuItem value={3}>Meses</MenuItem>
                              <MenuItem value={4}>Minutos</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <div className={classes.inputWithIcon}>
                          <SettingsIcon className={classes.fieldIcon} />
                          <Field
                            as={TextField}
                            label="Valor do Intervalo"
                            name="valorIntervalo"
                            size="small"
                            error={touched.valorIntervalo && Boolean(errors.valorIntervalo)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <div className={classes.inputWithIcon}>
                          <RepeatIcon className={classes.fieldIcon} />
                          <Field
                            as={TextField}
                            label="Número de Envios"
                            name="enviarQuantasVezes"
                            size="small"
                            error={touched.enviarQuantasVezes && Boolean(errors.enviarQuantasVezes)}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <div className={classes.inputWithIcon}>
                          <CalendarTodayIcon className={classes.fieldIcon} />
                          <FormControl size="small" fullWidth variant="outlined">
                            <InputLabel>Comportamento em Dias Não Úteis</InputLabel>
                            <Select
                              value={tipoDias}
                              onChange={(e) => setTipoDias(e.target.value || 4)}
                              label="Comportamento em Dias Não Úteis"
                            >
                              <MenuItem value={4}>Enviar normalmente</MenuItem>
                              <MenuItem value={5}>Enviar um dia útil antes</MenuItem>
                              <MenuItem value={6}>Enviar um dia útil depois</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Anexos */}
                  {(schedule.mediaPath || attachment) && (
                    <Grid item xs={12}>
                      <div className={classes.attachmentPreview}>
                        <AttachFile style={{ marginRight: '8px' }} />
                        <Typography variant="body2" style={{ flexGrow: 1 }}>
                          {attachment ? attachment.name : schedule.mediaName}
                        </Typography>
                        <IconButton
                          onClick={() => setConfirmationOpen(true)}
                          size="small"
                          style={{ color: red[500] }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              
              <DialogActions className={classes.dialogActions}>
                <div>
                  {!attachment && !schedule.mediaPath && (
                    <Button
                      startIcon={<AttachFileIcon />}
                      onClick={() => attachmentFile.current.click()}
                      disabled={isSubmitting}
                      variant="contained"
                      style={{
                        color: "white",
                        backgroundColor: "#FFA500",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {i18n.t("quickMessages.buttons.attach")}
                    </Button>
                  )}
                </div>
                
                <div className={classes.actionButtonsContainer}>
                  <Button
                    onClick={handleClose}
                    startIcon={<CancelIcon />}
                    disabled={isSubmitting}
                    variant="contained"
                    style={{
                      color: "white",
                      backgroundColor: "#db6565",
                      boxShadow: "none",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {i18n.t("scheduleModal.buttons.cancel")}
                  </Button>
                  
                  {(schedule.sentAt === null || schedule.sentAt === "") && (
                    <Button
                      type="submit"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                      variant="contained"
                      style={{
                        color: "white",
                        backgroundColor: "#437db5",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {scheduleId
                        ? `${i18n.t("scheduleModal.buttons.okEdit")}`
                        : `${i18n.t("scheduleModal.buttons.okAdd")}`}
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </Button>
                  )}
                </div>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ScheduleModal;