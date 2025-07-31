import React, { useState, useEffect, useRef, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { head } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { green, blue, red, orange } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Slide } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { isNil } from "lodash";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  InputAdornment,
  Avatar,
  Popover,
} from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import ConfirmationModal from "../ConfirmationModal";
import UserStatusIcon from "../UserModal/statusIcon";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import useQueues from "../../hooks/useQueues";
import EmojiPicker from 'emoji-picker-react';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';

// Icons for fields
import CampaignIcon from '@mui/icons-material/Campaign';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactsIcon from '@mui/icons-material/Contacts';
import LabelIcon from '@mui/icons-material/Label';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import QueueIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Transition component
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  dialogPaper: {
    borderRadius: "8px",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    background: "#ffffff",
    minWidth: "500px",
    maxWidth: "800px",
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "16px 24px",
    borderRadius: "8px 8px 0 0",
    fontSize: "1.5rem",
    fontWeight: 600,
    cursor: "move",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Alterado para alinhar à esquerda
    gap: theme.spacing(1),
  },
  dialogContent: {
    padding: "24px",
    background: "#f9fafc",
  },
  dialogActions: {
    padding: "16px 24px",
    background: "#f5f7fa",
    borderRadius: "0 0 8px 8px",
    display: "flex",
    justifyContent: "space-between",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#667eea",
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
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
  cancelButton: {
    backgroundColor: red[500],
    color: "white",
    "&:hover": {
      backgroundColor: red[700],
    },
    borderRadius: "8px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
  },
  saveButton: {
    backgroundColor: blue[500],
    color: "white",
    "&:hover": {
      backgroundColor: blue[700],
    },
    borderRadius: "8px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
  },
  attachButton: {
    backgroundColor: green[500],
    color: "white",
    "&:hover": {
      backgroundColor: green[700],
    },
    borderRadius: "8px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
  },
  restartButton: {
    backgroundColor: orange[500],
    color: "white",
    "&:hover": {
      backgroundColor: orange[700],
    },
    borderRadius: "8px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
  },
  tabs: {
    backgroundColor: "#667eea",
    color: "white",
    borderRadius: "8px 8px 0 0",
    "& .MuiTabs-indicator": {
      backgroundColor: "white",
      height: "3px",
    },
  },
  tab: {
    color: "white",
    fontWeight: 500,
    minWidth: "auto",
    padding: "12px 16px",
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  emojiPickerContainer: {
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fff",
  },
  fieldIcon: {
    color: "#667eea",
    marginRight: theme.spacing(1),
  },
  avatar: {
    backgroundColor: "#667eea",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  statusBadge: {
    backgroundColor: green[500],
    width: 12,
    height: 12,
    borderRadius: "50%",
    position: "absolute",
    bottom: 0,
    right: 0,
    border: "2px solid white",
  },
  messageField: {
    position: "relative",
    "& .MuiInputBase-root": {
      alignItems: "flex-start",
    },
  },
  emojiButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
}));

const CampaignSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const DraggablePaper = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const CampaignModal = ({
  open,
  onClose,
  campaignId,
  initialValues,
  onSave,
  resetPagination,
}) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);
  const { companyId } = user;

  const initialState = {
    name: "",
    message1: "",
    message2: "",
    message3: "",
    message4: "",
    message5: "",
    confirmationMessage1: "",
    confirmationMessage2: "",
    confirmationMessage3: "",
    confirmationMessage4: "",
    confirmationMessage5: "",
    status: "INATIVA",
    confirmation: false,
    scheduledAt: "",
    contactListId: "",
    tagListId: "Nenhuma",
    companyId,
    statusTicket: "closed",
    openTicket: "disabled",
  };

  const [campaign, setCampaign] = useState(initialState);
  const [whatsapps, setWhatsapps] = useState([]);
  const [whatsappId, setWhatsappId] = useState(false);
  const [contactLists, setContactLists] = useState([]);
  const [tagLists, setTagLists] = useState([]);
  const [messageTab, setMessageTab] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [campaignEditable, setCampaignEditable] = useState(true);
  const attachmentFile = useRef(null);
  const [options, setOptions] = useState([]);
  const [queues, setQueues] = useState([]);
  const [allQueues, setAllQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const { findAll: findAllQueues } = useQueues();

  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const emojiButtonRef = useRef(null);

  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const identifier = `message${messageTab + 1}`;
    setCampaign((prev) => ({
      ...prev,
      [identifier]: prev[identifier] + emoji,
    }));
    handleEmojiClose();
  };

  const emojiOpen = Boolean(emojiAnchorEl);
  const emojiId = emojiOpen ? 'emoji-popover' : undefined;

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
    if (isMounted.current) {
      if (initialValues) {
        setCampaign((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      api
        .get(`/contact-lists/list`, { params: { companyId } })
        .then(({ data }) => setContactLists(data));

      api
        .get(`/whatsapp`, { params: { companyId, session: 0 } })
        .then(({ data }) => {
          const mappedWhatsapps = data.map((whatsapp) => ({
            ...whatsapp,
            selected: false,
          }));
          setWhatsapps(mappedWhatsapps);
        });

      api
        .get(`/tags/list`, { params: { companyId, kanban: 0 } })
        .then(({ data }) => {
          const formattedTagLists = data
            .filter((tag) => tag.contacts.length > 0)
            .map((tag) => ({
              id: tag.id,
              name: `${tag.name} (${tag.contacts.length})`,
            }));
          setTagLists(formattedTagLists);
        })
        .catch((error) => {
          console.error("Error retrieving tags:", error);
        });

      if (!campaignId) return;

      api.get(`/campaigns/${campaignId}`).then(({ data }) => {
        if (data?.user) setSelectedUser(data.user);
        if (data?.queue) setSelectedQueue(data.queue.id);
        if (data?.whatsappId) setWhatsappId(data.whatsappId);
        setCampaign((prev) => {
          let prevCampaignData = Object.assign({}, prev);
          Object.entries(data).forEach(([key, value]) => {
            if (key === "scheduledAt" && value !== "" && value !== null) {
              prevCampaignData[key] = moment(value).format("YYYY-MM-DDTHH:mm");
            } else {
              prevCampaignData[key] = value === null ? "" : value;
            }
          });
          return prevCampaignData;
        });
      });
    }
  }, [campaignId, open, initialValues, companyId]);

  useEffect(() => {
    const now = moment();
    const scheduledAt = moment(campaign.scheduledAt);
    const moreThenAnHour =
      !Number.isNaN(scheduledAt.diff(now)) && scheduledAt.diff(now, "hour") > 1;
    const isEditable =
      campaign.status === "INATIVA" ||
      (campaign.status === "PROGRAMADA" && moreThenAnHour);
    setCampaignEditable(isEditable);
  }, [campaign.status, campaign.scheduledAt]);

  const handleClose = () => {
    onClose();
    setCampaign(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveCampaign = async (values) => {
    try {
      const dataValues = {
        ...values,
        whatsappId: whatsappId,
        userId: selectedUser?.id || null,
        queueId: selectedQueue || null,
      };

      Object.entries(values).forEach(([key, value]) => {
        if (key === "scheduledAt" && value !== "" && value !== null) {
          dataValues[key] = moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
          dataValues[key] = value === "" ? null : value;
        }
      });

      if (campaignId) {
        await api.put(`/campaigns/${campaignId}`, dataValues);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/campaigns/${campaignId}/media-upload`, formData);
        }
        handleClose();
      } else {
        const { data } = await api.post("/campaigns", dataValues);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/campaigns/${data.id}/media-upload`, formData);
        }
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("campaigns.toasts.success"));
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (campaign.mediaPath) {
      await api.delete(`/campaigns/${campaign.id}/media-upload`);
      setCampaign((prev) => ({ ...prev, mediaPath: null, mediaName: null }));
      toast.success(i18n.t("campaigns.toasts.deleted"));
    }
  };

  const renderMessageField = (identifier) => {
    return (
      <div className={classes.messageField}>
        <Field
          as={TextField}
          id={identifier}
          name={identifier}
          fullWidth
          rows={5}
          label={i18n.t(`campaigns.dialog.form.${identifier}`)}
          placeholder={i18n.t("campaigns.dialog.form.messagePlaceholder")}
          multiline={true}
          variant="outlined"
          helperText="Utilize variáveis como {nome}, {numero}, {email} ou defina variáveis personalizadas."
          disabled={!campaignEditable && campaign.status !== "CANCELADA"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          ref={emojiButtonRef}
          onClick={handleEmojiClick}
          className={classes.emojiButton}
        >
          <InsertEmoticonIcon color="action" />
        </IconButton>
        <Popover
          id={emojiId}
          open={emojiOpen}
          anchorEl={emojiAnchorEl}
          onClose={handleEmojiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.emojiPickerContainer}>
            <EmojiPicker 
              onEmojiClick={onEmojiClick}
              width={350}
              height={400}
            />
          </div>
        </Popover>
      </div>
    );
  };

  const renderConfirmationMessageField = (identifier) => {
    return (
      <Field
        as={TextField}
        id={identifier}
        name={identifier}
        fullWidth
        rows={5}
        label={i18n.t(`campaigns.dialog.form.${identifier}`)}
        placeholder={i18n.t("campaigns.dialog.form.messagePlaceholder")}
        multiline={true}
        variant="outlined"
        disabled={!campaignEditable && campaign.status !== "CANCELADA"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CheckCircleIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const cancelCampaign = async () => {
    try {
      await api.post(`/campaigns/${campaign.id}/cancel`);
      toast.success(i18n.t("campaigns.toasts.cancel"));
      setCampaign((prev) => ({ ...prev, status: "CANCELADA" }));
      resetPagination();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const restartCampaign = async () => {
    try {
      await api.post(`/campaigns/${campaign.id}/restart`);
      toast.success(i18n.t("campaigns.toasts.restart"));
      setCampaign((prev) => ({ ...prev, status: "EM_ANDAMENTO" }));
      resetPagination();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filterOptions = createFilterOptions({
    trim: true,
  });

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        TransitionComponent={Transition}
        classes={{ paper: classes.dialogPaper }}
        PaperComponent={DraggablePaper}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle
          id="draggable-dialog-title"
          className={classes.dialogTitle}
        >
          <CampaignIcon fontSize="large" />
          {campaignEditable ? (
            <>
              {campaignId
                ? `${i18n.t("campaigns.dialog.update")}`
                : `${i18n.t("campaigns.dialog.new")}`}
            </>
          ) : (
            <>{`${i18n.t("campaigns.dialog.readonly")}`}</>
          )}
        </DialogTitle>
        <div style={{ display: "none" }}>
          <input
            type="file"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
          />
        </div>
        <Formik
          initialValues={campaign}
          enableReinitialize={true}
          validationSchema={CampaignSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveCampaign(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers className={classes.dialogContent}>
                <Grid spacing={2} container>
                  <Grid xs={12} md={4} item>
                    <Field
                      as={TextField}
                      label={i18n.t("campaigns.dialog.form.name")}
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.textField}
                      disabled={!campaignEditable}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CampaignIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="confirmation-selection-label">
                        {i18n.t("campaigns.dialog.form.confirmation")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.confirmation")}
                        placeholder={i18n.t(
                          "campaigns.dialog.form.confirmation"
                        )}
                        labelId="confirmation-selection-label"
                        id="confirmation"
                        name="confirmation"
                        error={
                          touched.confirmation && Boolean(errors.confirmation)
                        }
                        disabled={!campaignEditable}
                      >
                        <MenuItem value={false}>Desabilitada</MenuItem>
                        <MenuItem value={true}>Habilitada</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="contactList-selection-label">
                        {i18n.t("campaigns.dialog.form.contactList")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.contactList")}
                        placeholder={i18n.t(
                          "campaigns.dialog.form.contactList"
                        )}
                        labelId="contactList-selection-label"
                        id="contactListId"
                        name="contactListId"
                        error={
                          touched.contactListId && Boolean(errors.contactListId)
                        }
                        disabled={!campaignEditable}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ContactsIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Nenhuma</MenuItem>
                        {contactLists &&
                          contactLists.map((contactList) => (
                            <MenuItem
                              key={contactList.id}
                              value={contactList.id}
                            >
                              {contactList.name}
                            </MenuItem>
                          ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="tagList-selection-label">
                        {i18n.t("campaigns.dialog.form.tagList")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.tagList")}
                        placeholder={i18n.t("campaigns.dialog.form.tagList")}
                        labelId="tagList-selection-label"
                        id="tagListId"
                        name="tagListId"
                        error={touched.tagListId && Boolean(errors.tagListId)}
                        disabled={!campaignEditable}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LabelIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {Array.isArray(tagLists) &&
                          tagLists.map((tagList) => (
                            <MenuItem key={tagList.id} value={tagList.id}>
                              {tagList.name}
                            </MenuItem>
                          ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="whatsapp-selection-label">
                        {i18n.t("campaigns.dialog.form.whatsapp")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.whatsapp")}
                        placeholder={i18n.t("campaigns.dialog.form.whatsapp")}
                        labelId="whatsapp-selection-label"
                        id="whatsappIds"
                        name="whatsappIds"
                        required
                        error={touched.whatsappId && Boolean(errors.whatsappId)}
                        disabled={!campaignEditable}
                        value={whatsappId}
                        onChange={(event) => {
                          setWhatsappId(event.target.value);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WhatsAppIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {whatsapps &&
                          whatsapps.map((whatsapp) => (
                            <MenuItem key={whatsapp.id} value={whatsapp.id}>
                              {whatsapp.name}
                            </MenuItem>
                          ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <Field
                      as={TextField}
                      label={i18n.t("campaigns.dialog.form.scheduledAt")}
                      name="scheduledAt"
                      error={touched.scheduledAt && Boolean(errors.scheduledAt)}
                      helperText={touched.scheduledAt && errors.scheduledAt}
                      variant="outlined"
                      margin="dense"
                      type="datetime-local"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      className={classes.textField}
                      disabled={!campaignEditable}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ScheduleIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="openTicket-selection-label">
                        {i18n.t("campaigns.dialog.form.openTicket")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.openTicket")}
                        placeholder={i18n.t(
                          "campaigns.dialog.form.openTicket"
                        )}
                        labelId="openTicket-selection-label"
                        id="openTicket"
                        name="openTicket"
                        error={
                          touched.openTicket && Boolean(errors.openTicket)
                        }
                        disabled={!campaignEditable}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TicketIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value={"enabled"}>
                          {i18n.t("campaigns.dialog.form.enabledOpenTicket")}
                        </MenuItem>
                        <MenuItem value={"disabled"}>
                          {i18n.t("campaigns.dialog.form.disabledOpenTicket")}
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <Autocomplete
                      style={{ marginTop: "8px" }}
                      variant="outlined"
                      margin="dense"
                      className={classes.formControl}
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
                      disabled={!campaignEditable || values.openTicket === "disabled"}
                      noOptionsText={i18n.t("transferTicketModal.noOptions")}
                      loading={loading}
                      renderOption={(option) => (
                        <Box display="flex" alignItems="center">
                          <Box position="relative" mr={1}>
                            <Avatar
                              src={option.avatar && option.avatar.url}
                              className={classes.avatar}
                            >
                              {option.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className={classes.statusBadge} />
                          </Box>
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={i18n.t("transferTicketModal.fieldLabel")}
                          variant="outlined"
                          onChange={(e) => setSearchParam(e.target.value)}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
                            ),
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
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel>
                        {i18n.t("transferTicketModal.fieldQueueLabel")}
                      </InputLabel>
                      <Select
                        value={selectedQueue}
                        onChange={(e) => setSelectedQueue(e.target.value)}
                        label={i18n.t("transferTicketModal.fieldQueuePlaceholder")}
                        required={!isNil(selectedUser)}
                        disabled={!campaignEditable || values.openTicket === "disabled"}
                        startAdornment={
                          <InputAdornment position="start">
                            <QueueIcon color="action" />
                          </InputAdornment>
                        }
                      >
                        {queues.map((queue) => (
                          <MenuItem key={queue.id} value={queue.id}>
                            {queue.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4} item>
                    <FormControl
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel id="statusTicket-selection-label">
                        {i18n.t("campaigns.dialog.form.statusTicket")}
                      </InputLabel>
                      <Field
                        as={Select}
                        label={i18n.t("campaigns.dialog.form.statusTicket")}
                        placeholder={i18n.t(
                          "campaigns.dialog.form.statusTicket"
                        )}
                        labelId="statusTicket-selection-label"
                        id="statusTicket"
                        name="statusTicket"
                        error={
                          touched.statusTicket && Boolean(errors.statusTicket)
                        }
                        disabled={!campaignEditable || values.openTicket === "disabled"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TicketIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value={"closed"}>
                          {i18n.t("campaigns.dialog.form.closedTicketStatus")}
                        </MenuItem>
                        <MenuItem value={"pending"}>
                          {i18n.t("campaigns.dialog.form.pendingTicketStatus")}
                        </MenuItem>
                        <MenuItem value={"open"}>
                          {i18n.t("campaigns.dialog.form.openTicketStatus")}
                        </MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} item>
                    <Tabs
                      value={messageTab}
                      indicatorColor="primary"
                      onChange={(e, v) => setMessageTab(v)}
                      variant="fullWidth"
                      centered
                      className={classes.tabs}
                    >
                      <Tab label="Msg. 1" index={0} className={classes.tab} />
                      <Tab label="Msg. 2" index={1} className={classes.tab} />
                      <Tab label="Msg. 3" index={2} className={classes.tab} />
                      <Tab label="Msg. 4" index={3} className={classes.tab} />
                      <Tab label="Msg. 5" index={4} className={classes.tab} />
                    </Tabs>
                    <Box style={{ paddingTop: 20 }}>
                      {messageTab === 0 && (
                        <>
                          {values.confirmation ? (
                            <Grid spacing={2} container>
                              <Grid xs={12} md={8} item>
                                <>{renderMessageField("message1")}</>
                              </Grid>
                              <Grid xs={12} md={4} item>
                                <>
                                  {renderConfirmationMessageField(
                                    "confirmationMessage1"
                                  )}
                                </>
                              </Grid>
                            </Grid>
                          ) : (
                            <>{renderMessageField("message1")}</>
                          )}
                        </>
                      )}
                      {messageTab === 1 && (
                        <>
                          {values.confirmation ? (
                            <Grid spacing={2} container>
                              <Grid xs={12} md={8} item>
                                <>{renderMessageField("message2")}</>
                              </Grid>
                              <Grid xs={12} md={4} item>
                                <>
                                  {renderConfirmationMessageField(
                                    "confirmationMessage2"
                                  )}
                                </>
                              </Grid>
                            </Grid>
                          ) : (
                            <>{renderMessageField("message2")}</>
                          )}
                        </>
                      )}
                      {messageTab === 2 && (
                        <>
                          {values.confirmation ? (
                            <Grid spacing={2} container>
                              <Grid xs={12} md={8} item>
                                <>{renderMessageField("message3")}</>
                              </Grid>
                              <Grid xs={12} md={4} item>
                                <>
                                  {renderConfirmationMessageField(
                                    "confirmationMessage3"
                                  )}
                                </>
                              </Grid>
                            </Grid>
                          ) : (
                            <>{renderMessageField("message3")}</>
                          )}
                        </>
                      )}
                      {messageTab === 3 && (
                        <>
                          {values.confirmation ? (
                            <Grid spacing={2} container>
                              <Grid xs={12} md={8} item>
                                <>{renderMessageField("message4")}</>
                              </Grid>
                              <Grid xs={12} md={4} item>
                                <>
                                  {renderConfirmationMessageField(
                                    "confirmationMessage4"
                                  )}
                                </>
                              </Grid>
                            </Grid>
                          ) : (
                            <>{renderMessageField("message4")}</>
                          )}
                        </>
                      )}
                      {messageTab === 4 && (
                        <>
                          {values.confirmation ? (
                            <Grid spacing={2} container>
                              <Grid xs={12} md={8} item>
                                <>{renderMessageField("message5")}</>
                              </Grid>
                              <Grid xs={12} md={4} item>
                                <>
                                  {renderConfirmationMessageField(
                                    "confirmationMessage5"
                                  )}
                                </>
                              </Grid>
                            </Grid>
                          ) : (
                            <>{renderMessageField("message5")}</>
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                  {(campaign.mediaPath || attachment) && (
                    <Grid xs={12} item>
                      <Box display="flex" alignItems="center">
                        <AttachFileIcon color="action" style={{ marginRight: 8 }} />
                        <span>
                          {attachment != null
                            ? attachment.name
                            : campaign.mediaName}
                        </span>
                        {campaignEditable && (
                          <IconButton
                            onClick={() => setConfirmationOpen(true)}
                            color="secondary"
                            style={{ marginLeft: 8 }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions className={classes.dialogActions}>
                <Box>
                  {campaign.status === "CANCELADA" && (
                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#1E90FF",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                        marginRight: 8,
                      }}
                      startIcon={<RestartAltIcon />}
                      onClick={() => restartCampaign()}
                      variant="contained"
                    >
                      {i18n.t("campaigns.dialog.buttons.restart")}
                    </Button>
                  )}
                  {campaign.status === "EM_ANDAMENTO" && (
                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#db6565",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                        marginRight: 8,
                      }}
                      startIcon={<CancelIcon />}
                      onClick={() => cancelCampaign()}
                      variant="contained"
                    >
                      {i18n.t("campaigns.dialog.buttons.cancel")}
                    </Button>
                  )}
                  {!attachment && !campaign.mediaPath && campaignEditable && (
                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#4ec24e",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                      startIcon={<AttachFileIcon />}
                      onClick={() => attachmentFile.current.click()}
                      disabled={isSubmitting}
                      variant="contained"
                    >
                      {i18n.t("campaigns.dialog.buttons.attach")}
                    </Button>
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "#db6565",
                      boxShadow: "none",
                      borderRadius: "5px",
                      fontSize: "12px",
                      marginRight: 16,
                    }}
                    startIcon={<CancelIcon />}
                    onClick={handleClose}
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {i18n.t("campaigns.dialog.buttons.close")}
                  </Button>
                  {(campaignEditable || campaign.status === "CANCELADA") && (
                    <Button
                      style={{
                        color: "white",
                        backgroundColor: "#437db5",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                      }}
                      startIcon={<SaveIcon />}
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                    >
                      {campaignId
                        ? `${i18n.t("campaigns.dialog.buttons.edit")}`
                        : `${i18n.t("campaigns.dialog.buttons.add")}`}
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </Button>
                  )}
                </Box>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default CampaignModal;