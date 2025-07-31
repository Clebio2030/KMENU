import React, { useState, useEffect, useRef, useContext, Fragment } from "react";
import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";
import { 
  FormControl, 
  FormControlLabel, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select,
  Tab, 
  Tabs 
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import { i18n } from "../../translate/i18n";
import Switch from "@material-ui/core/Switch";
import { isArray } from "lodash";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import { IconButton, InputAdornment } from "@material-ui/core";
import { Colorize } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import ConfirmationModal from "../ConfirmationModal";
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';
import OptionsChatBot from "../ChatBots/options";
import CustomToolTip from "../ToolTips";
import SchedulesForm from "../SchedulesForm";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import { AuthContext } from "../../context/Auth/AuthContext";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import useQueues from "../../hooks/useQueues";
import UserStatusIcon from "../UserModal/statusIcon";
import usePlans from "../../hooks/usePlans";
import ColorBoxModal from "../ColorBoxModal";
import Slide from '@material-ui/core/Slide';
import PersonIcon from '@material-ui/icons/Person';
import ScheduleIcon from '@material-ui/icons/Schedule';
import MessageIcon from '@material-ui/icons/Message';
import SettingsIcon from '@material-ui/icons/Settings';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import FolderIcon from '@material-ui/icons/Folder';
import IntegrationIcon from '@material-ui/icons/Extension';
import QueueIcon from '@material-ui/icons/Queue';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  textField1: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  greetingMessage: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  custom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "16px 24px",
    fontSize: "1.25rem",
    fontWeight: 500,
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  dialogContent: {
    padding: theme.spacing(3),
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  dialogActions: {
    padding: theme.spacing(2),
    background: "#f5f5f5",
    borderTop: "1px solid #e0e0e0",
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    position: 'sticky',
    bottom: 0,
    zIndex: 2,
  },
  cancelButton: {
    color: "white",
    backgroundColor: "#db6565",
    boxShadow: "none",
    borderRadius: "5px",
    fontSize: "12px",
    "&:hover": {
      backgroundColor: "#c65454",
    },
  },
  saveButton: {
    color: "white",
    backgroundColor: "#437db5",
    boxShadow: "none",
    borderRadius: "5px",
    fontSize: "12px",
    "&:hover": {
      backgroundColor: "#356a9a",
    },
  },
  fieldIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  scheduleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(3),
  },
  scheduleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  scheduleDay: {
    width: "120px",
    textAlign: "left",
    fontWeight: theme.typography.fontWeightMedium,
  },
  scheduleTimeContainer: {
    display: "flex",
    alignItems: "center",
  },
  scheduleTimeGroup: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0, 2),
  },
  scheduleTimeField: {
    width: "120px",
    margin: theme.spacing(0, 1),
  },
  scheduleDivider: {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
  },
  scheduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  scheduleHeaderText: {
    fontWeight: theme.typography.fontWeightMedium,
    flex: 1,
    textAlign: "center",
  },
  colorOrderContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  colorFieldContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  orderFieldContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formContent: {
    flex: 1,
    overflowY: 'auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Obrigatório"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required("A cor é Obrigatório"),
  greetingMessage: Yup.string(),
  chatbots: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().min(4, "too short").required("Obrigatório"),
      })
    )
    .required("Must have friends"),
});

const QueueModal = ({ open, onClose, queueId, onEdit }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
    chatbots: [],
    outOfHoursMessage: "",
    orderQueue: "",
    tempoRoteador: 0,
    ativarRoteador: false,
    integrationId: "",
    fileListId: "",
    closeTicket: false
  };

  const initialStateSchedule = [
    { weekday: i18n.t("queueModal.serviceHours.monday"), weekdayEn: "monday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: i18n.t("queueModal.serviceHours.tuesday"), weekdayEn: "tuesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: i18n.t("queueModal.serviceHours.wednesday"), weekdayEn: "wednesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: i18n.t("queueModal.serviceHours.thursday"), weekdayEn: "thursday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: i18n.t("queueModal.serviceHours.friday"), weekdayEn: "friday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: "Sábado", weekdayEn: "saturday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" },
    { weekday: "Domingo", weekdayEn: "sunday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "12:01", endTimeB: "23:00" }
  ];

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const greetingRef = useRef();
  const [activeStep, setActiveStep] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isStepContent, setIsStepContent] = useState(true);
  const [isNameEdit, setIsNamedEdit] = useState(null);
  const [isGreetingMessageEdit, setGreetingMessageEdit] = useState(null);
  const [queues, setQueues] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const { user, socket } = useContext(AuthContext);
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedQueueOption, setSelectedQueueOption] = useState("");
  const { findAll: findAllQueues } = useQueues();
  const [allQueues, setAllQueues] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const isMounted = useRef(true);
  const [schedules, setSchedules] = useState(initialStateSchedule);
  const companyId = user.companyId;
  const { get: getSetting } = useCompanySettings();
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const setting = await getSetting({
        "column": "scheduleType"
      });
      if (setting.scheduleType === "queue") setSchedulesEnabled(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/files/", {
          params: { companyId }
        });

        setFile(data.files);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);

        setQueue((prevState) => {
          return { ...prevState, ...data };
        });

        if (isArray(data.schedules) && data.schedules.length > 0)
          setSchedules(data.schedules);
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue({
        name: "",
        color: "",
        greetingMessage: "",
        chatbots: [],
        outOfHoursMessage: "",
        orderQueue: "",
        tempoRoteador: "",
        ativarRoteador: false,
        integrationId: "",
        fileListId: "",
        closeTicket: false
      });
    };
  }, [queueId, open]);

  useEffect(() => {
    if (isMounted.current) {
      const loadQueues = async () => {
        const list = await findAllQueues();
        setAllQueues(list);
        setQueues(list);
      };
      loadQueues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParam.length < 3) {
      setLoading(false);
      setSelectedQueueOption("");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/");
          setUserOptions(data.users);
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
    (async () => {
      try {
        const { data } = await api.get("/queueIntegration");

        setIntegrations(data.queueIntegrations);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeStep) {
      setSelectedQueueOption(queue.chatbots[activeStep]?.optQueueId)
    }

    if (activeStep === isNameEdit) {
      setIsStepContent(false);
    } else {
      setIsStepContent(true);
    }
  }, [isNameEdit, activeStep]);

  const handleClose = () => {
    onClose();
    setIsNamedEdit(null);
    setActiveStep(null);
    setGreetingMessageEdit(null);
  };

  const handleSaveSchedules = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...queue, schedules: values });
        toast.success("Horários atualizados com sucesso!");
      } else {
        toast.success("Horários configurados com sucesso!");
      }
      setSchedules(values);
      setTab(0);
    } catch (err) {
      toastError(err);
    }
  };

  const filterOptions = createFilterOptions({
    trim: true,
  });

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (optionsId) => {
    try {
      await api.delete(`/chatbot/${optionsId}`);
      const { data } = await api.get(`/queue/${queueId}`);
      setQueue(initialState);
      setQueue(data);

      setIsNamedEdit(null);
      setGreetingMessageEdit(null);
      toast.success(`${i18n.t("queues.toasts.deleted")}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveQueue = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...values, schedules });
      } else {
        await api.post("/queue", { ...values, schedules });
      }

      toast.success(`${i18n.t("queues.toasts.success")}`);
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveBot = async (values) => {
    try {
      if (queueId) {
        const { data } = await api.put(`/queue/${queueId}`, values);
        if (data.chatbots && data.chatbots.length) {
          onEdit(data);
          setQueue(data);
        }
      } else {
        const { data } = await api.post("/queue", values);
        if (data.chatbots && data.chatbots.length) {
          setQueue(data);
          onEdit(data);
          handleClose();
        }
      }

      setIsNamedEdit(null)
      setGreetingMessageEdit(null)
      toast.success(`${i18n.t("queues.toasts.success")}`);

    } catch (err) {
      toastError(err);
    }
  };

  const renderSchedulesTab = () => {
    return (
      <div className={classes.scheduleContainer}>
        <div className={classes.scheduleHeader}>
          <div className={classes.scheduleDay}>
            <Typography variant="subtitle2">Dia da Semana</Typography>
          </div>
          <div className={classes.scheduleTimeContainer}>
            <Typography variant="subtitle2" className={classes.scheduleHeaderText}>Jornada de Trabalho</Typography>
          </div>
        </div>

        {schedules.map((schedule, index) => (
          <div key={index} className={classes.scheduleRow}>
            <div className={classes.scheduleDay}>
              <Typography variant="body1">{schedule.weekday}</Typography>
            </div>
            <div className={classes.scheduleTimeContainer}>
              <div className={classes.scheduleTimeGroup}>
                <TextField
                  label="Início"
                  type="time"
                  value={schedule.startTimeA}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  variant="outlined"
                  size="small"
                  className={classes.scheduleTimeField}
                  onChange={(e) => {
                    const newSchedules = [...schedules];
                    newSchedules[index].startTimeA = e.target.value;
                    setSchedules(newSchedules);
                  }}
                />
                <Typography className={classes.scheduleDivider}>às</Typography>
                <TextField
                  label="Fim"
                  type="time"
                  value={schedule.endTimeA}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  variant="outlined"
                  size="small"
                  className={classes.scheduleTimeField}
                  onChange={(e) => {
                    const newSchedules = [...schedules];
                    newSchedules[index].endTimeA = e.target.value;
                    setSchedules(newSchedules);
                  }}
                />
              </div>

              <div className={classes.scheduleTimeGroup}>
                <TextField
                  label="Início"
                  type="time"
                  value={schedule.startTimeB}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  variant="outlined"
                  size="small"
                  className={classes.scheduleTimeField}
                  onChange={(e) => {
                    const newSchedules = [...schedules];
                    newSchedules[index].startTimeB = e.target.value;
                    setSchedules(newSchedules);
                  }}
                />
                <Typography className={classes.scheduleDivider}>às</Typography>
                <TextField
                  label="Fim"
                  type="time"
                  value={schedule.endTimeB}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  variant="outlined"
                  size="small"
                  className={classes.scheduleTimeField}
                  onChange={(e) => {
                    const newSchedules = [...schedules];
                    newSchedules[index].endTimeB = e.target.value;
                    setSchedules(newSchedules);
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSaveSchedules(schedules)}
          style={{
            color: "white",
            backgroundColor: "#437db5",
            boxShadow: "none",
            borderRadius: "5px",
            fontSize: "12px",
          }}
          startIcon={<SaveIcon />}
        >
          Salvar Horários
        </Button>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queueModal.title.confirmationDelete")}
      </ConfirmationModal>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={handleClose}
        scroll="paper"
        TransitionComponent={Transition}
        transitionDuration={300}
        classes={{ paper: classes.dialog }}
      >
        <DialogTitle className={classes.dialogTitle}>
          {queueId
            ? `${i18n.t("queueModal.title.edit")}`
            : `${i18n.t("queueModal.title.add")}`}
        </DialogTitle>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, v) => setTab(v)}
          aria-label="disabled tabs example"
        >
          <Tab label={i18n.t("queueModal.title.queueData")} />
          {schedulesEnabled && <Tab label={i18n.t("Horários de Atendimento")} />}
        </Tabs>
        {tab === 0 && (
          <Formik
            initialValues={queue}
            validateOnChange={false}
            enableReinitialize={true}
            validationSchema={QueueSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveQueue(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ setFieldValue, touched, errors, isSubmitting, values }) => (
              <Form className={classes.formContainer}>
                <DialogContent dividers className={classes.dialogContent}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon className={classes.fieldIcon} />
                    <Field
                      as={TextField}
                      label={i18n.t("queueModal.form.name")}
                      autoFocus
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </div>
                  
                  <div className={classes.colorOrderContainer}>
                    <div className={classes.colorFieldContainer}>
                      <Colorize className={classes.fieldIcon} />
                      <Field
                        as={TextField}
                        label={i18n.t("queueModal.form.color")}
                        name="color"
                        id="color"
                        onFocus={() => {
                          setColorPickerModalOpen(true);
                          greetingRef.current.focus();
                        }}
                        error={touched.color && Boolean(errors.color)}
                        helperText={touched.color && errors.color}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <div
                                style={{ backgroundColor: values.color }}
                                className={classes.colorAdorment}
                              ></div>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => setColorPickerModalOpen(!colorPickerModalOpen)}
                            >
                              <Colorize />
                            </IconButton>
                          ),
                        }}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                      />
                    </div>
                    
                    <div className={classes.orderFieldContainer}>
                      <QueueIcon className={classes.fieldIcon} />
                      <Field
                        as={TextField}
                        label={i18n.t("queueModal.form.orderQueue")}
                        name="orderQueue"
                        type="orderQueue"
                        error={touched.orderQueue && Boolean(errors.orderQueue)}
                        helperText={touched.orderQueue && errors.orderQueue}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                      />
                    </div>
                  </div>
                  
                  <ColorBoxModal
                    open={colorPickerModalOpen}
                    handleClose={() => setColorPickerModalOpen(false)}
                    onChange={(color) => {
                      setFieldValue("color", `#${color.hex}`);
                    }}
                    currentColor={values.color}
                  />
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SettingsIcon className={classes.fieldIcon} />
                    <FormControlLabel
                      control={
                        <Field
                          as={Switch}
                          color="primary"
                          name="closeTicket"
                          checked={values.closeTicket}
                        />
                      }
                      label={i18n.t("queueModal.form.closeTicket")}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RotateLeftIcon className={classes.fieldIcon} />
                    <FormControlLabel
                      control={
                        <Field
                          as={Switch}
                          color="primary"
                          name="ativarRoteador"
                          checked={values.ativarRoteador}
                        />
                      }
                      label={i18n.t("queueModal.form.rotate")}
                    />
                    <Field
                      as={Select}
                      label={i18n.t("queueModal.form.timeRotate")}
                      name="tempoRoteador"
                      id="tempoRoteador"
                      variant="outlined"
                      margin="dense"
                      className={classes.selectField}
                    >
                      <MenuItem value="0" selected disabled>{i18n.t("queueModal.form.timeRotate")}</MenuItem>
                      <MenuItem value="2">2 minutos</MenuItem>
                      <MenuItem value="5">5 minutos</MenuItem>
                      <MenuItem value="10">10 minutos</MenuItem>
                      <MenuItem value="15">15 minutos</MenuItem>
                      <MenuItem value="30">30 minutos</MenuItem>
                      <MenuItem value="45">45 minutos</MenuItem>
                      <MenuItem value="60">60 minutos</MenuItem>
                    </Field>
                  </div>
                  
                  <div>
                    {showIntegrations && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IntegrationIcon className={classes.fieldIcon} />
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          className={classes.FormControl}
                          fullWidth
                        >
                          <InputLabel id="integrationId-selection-label">
                            {i18n.t("queueModal.form.integrationId")}
                          </InputLabel>
                          <Field
                            as={Select}
                            label={i18n.t("queueModal.form.integrationId")}
                            name="integrationId"
                            id="integrationId"
                            placeholder={i18n.t("queueModal.form.integrationId")}
                            labelId="integrationId-selection-label"
                            value={values.integrationId || ""}
                          >
                            <MenuItem value={""} >{"Nenhum"}</MenuItem>
                            {integrations.map((integration) => (
                              <MenuItem key={integration.id} value={integration.id}>
                                {integration.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </FormControl>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon className={classes.fieldIcon} />
                      <FormControl
                        variant="outlined"
                        margin="dense"
                        className={classes.FormControl}
                        fullWidth
                      >
                        <InputLabel id="fileListId-selection-label">{i18n.t("queueModal.form.fileListId")}</InputLabel>
                        <Field
                          as={Select}
                          label={i18n.t("queueModal.form.fileListId")}
                          name="fileListId"
                          id="fileListId"
                          placeholder={i18n.t("queueModal.form.fileListId")}
                          labelId="fileListId-selection-label"
                          value={values.fileListId || ""}
                        >
                          <MenuItem value={""} >{"Nenhum"}</MenuItem>
                          {file.map(f => (
                            <MenuItem key={f.id} value={f.id}>
                              {f.name}
                            </MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MessageIcon className={classes.fieldIcon} />
                      <Field
                        as={TextField}
                        label={i18n.t("queueModal.form.greetingMessage")}
                        type="greetingMessage"
                        multiline
                        inputRef={greetingRef}
                        minRows={5}
                        fullWidth
                        name="greetingMessage"
                        error={
                          touched.greetingMessage && Boolean(errors.greetingMessage)
                        }
                        helperText={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        variant="outlined"
                        margin="dense"
                      />
                    </div>
                    
                    {schedulesEnabled && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon className={classes.fieldIcon} />
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.outOfHoursMessage")}
                          type="outOfHoursMessage"
                          multiline
                          rows={5}
                          fullWidth
                          required={schedulesEnabled}
                          name="outOfHoursMessage"
                          error={
                            touched.outOfHoursMessage &&
                            Boolean(errors.outOfHoursMessage)
                          }
                          helperText={
                            touched.outOfHoursMessage && errors.outOfHoursMessage
                          }
                          variant="outlined"
                          margin="dense"
                        />
                      </div>
                    )}
                  </div>

                  <Typography variant="subtitle1">
                    {i18n.t("queueModal.bot.title")}
                    <CustomToolTip
                      title={i18n.t("queueModal.bot.toolTipTitle")}
                      content={i18n.t("queueModal.bot.toolTip")}
                    >
                      <HelpOutlineOutlinedIcon
                        style={{ marginLeft: "14px" }}
                        fontSize="small"
                      />
                    </CustomToolTip>
                  </Typography>

                  <div>
                    <FieldArray name="chatbots">
                      {({ push, remove }) => (
                        <>
                          <Stepper
                            nonLinear
                            activeStep={activeStep}
                            orientation="vertical"
                          >
                            {values.chatbots &&
                              values.chatbots.length > 0 &&
                              values.chatbots.map((info, index) => (
                                <Step
                                  key={`${info.id ? info.id : index}-chatbots`}
                                  onClick={() => setActiveStep(index)}
                                >
                                  <StepLabel key={`${info.id}-chatbots`}>
                                    {isNameEdit !== index &&
                                      queue.chatbots[index]?.name ? (
                                      <div
                                        className={classes.greetingMessage}
                                        variant="body1"
                                      >
                                        {values.chatbots[index].name}

                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            setIsNamedEdit(index);
                                            setIsStepContent(false);
                                          }}
                                        >
                                          <EditIcon style={{ color: "#437db5" }} />
                                        </IconButton>

                                        <IconButton
                                          onClick={() => {
                                            setSelectedQueue(info);
                                            setConfirmModalOpen(true);
                                          }}
                                          size="small"
                                        >
                                          <DeleteOutline style={{ color: "#db6565" }} />
                                        </IconButton>
                                      </div>
                                    ) : (
                                      <Grid spacing={2} container>
                                        <Grid xs={12} md={12} item>
                                          <Field
                                            as={TextField}
                                            name={`chatbots[${index}].name`}
                                            variant="outlined"
                                            margin="dense"
                                            color="primary"
                                            label={i18n.t("queueModal.form.greetingMessage")}
                                            disabled={isSubmitting}
                                            autoFocus
                                            fullWidth
                                            size="small"
                                            error={
                                              touched?.chatbots?.[index]?.name &&
                                              Boolean(
                                                errors.chatbots?.[index]?.name
                                              )
                                            }
                                            className={classes.textField}
                                          />
                                        </Grid>
                                        <Grid xs={12} md={8} item>
                                          <FormControl
                                            variant="outlined"
                                            margin="dense"
                                            className={classes.formControl}
                                            fullWidth
                                          >
                                            <InputLabel id="queueType-selection-label">{i18n.t("queueModal.form.queueType")}</InputLabel>

                                            <Field
                                              as={Select}
                                              name={`chatbots[${index}].queueType`}
                                              variant="outlined"
                                              margin="dense"
                                              fullWidth
                                              labelId="queueType-selection-label"
                                              label={i18n.t("queueModal.form.queueType")}
                                              error={touched?.chatbots?.[index]?.queueType &&
                                                Boolean(errors?.chatbots?.[index]?.queueType)}
                                            >
                                              <MenuItem value={"text"}><TextFieldsIcon style={{ marginRight: 8 }} />{i18n.t("queueModal.bot.text")}</MenuItem>
                                              <MenuItem value={"attendent"}><PersonIcon style={{ marginRight: 8 }} />{i18n.t("queueModal.bot.attendent")}</MenuItem>
                                              <MenuItem value={"queue"}><QueueIcon style={{ marginRight: 8 }} />{i18n.t("queueModal.bot.queue")}</MenuItem>
                                              <MenuItem value={"integration"}><IntegrationIcon style={{ marginRight: 8 }} />{i18n.t("queueModal.bot.integration")}</MenuItem>
                                              <MenuItem value={"file"}><AttachFileIcon style={{ marginRight: 8 }} />{i18n.t("queueModal.bot.file")}</MenuItem>
                                            </Field>
                                          </FormControl>
                                        </Grid>

                                        <Grid xs={12} md={4} item>
                                          <FormControlLabel
                                            control={
                                              <Field
                                                as={Checkbox}
                                                color="primary"
                                                name={`chatbots[${index}].closeTicket`}
                                                checked={values.chatbots[index].closeTicket || false}
                                              />
                                            }
                                            labelPlacement="top"
                                            label={i18n.t("queueModal.form.closeTicket")}
                                          />

                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              values.chatbots[index].name
                                                ? handleSaveBot(values)
                                                : null
                                            }
                                            disabled={isSubmitting}
                                          >
                                            <SaveIcon style={{ color: "#437db5" }} />
                                          </IconButton>

                                          <IconButton
                                            size="small"
                                            onClick={() => remove(index)}
                                            disabled={isSubmitting}
                                          >
                                            <DeleteOutline style={{ color: "#db6565" }} />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    )}
                                  </StepLabel>

                                  {isStepContent && queue.chatbots[index] && (
                                    <StepContent>
                                      <>
                                        {isGreetingMessageEdit !== index ? (
                                          <div
                                            className={classes.greetingMessage}
                                          >
                                            <Typography
                                              color="textSecondary"
                                              variant="body1"
                                            >
                                              Message:
                                            </Typography>

                                            {
                                              values.chatbots[index]
                                                .greetingMessage
                                            }

                                            {!queue.chatbots[index]
                                              ?.greetingMessage && (
                                                <CustomToolTip
                                                  title={i18n.t("queueModal.bot.toolTipMessageTitle")}
                                                  content={`${i18n.t("queueModal.bot.toolTipMessageContent")} ${queue.chatbots[index].queueType}`}
                                                >
                                                  <HelpOutlineOutlinedIcon
                                                    color="secondary"
                                                    style={{ marginLeft: "4px" }}
                                                    fontSize="small"
                                                  />
                                                </CustomToolTip>
                                              )}

                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                setGreetingMessageEdit(index)
                                              }
                                            >
                                              <EditIcon style={{ color: "#437db5" }} />
                                            </IconButton>
                                          </div>
                                        ) : (
                                          <Grid spacing={2} container>
                                            <div
                                              className={classes.greetingMessage}
                                            >
                                              {queue.chatbots[index].queueType === "text" && (
                                                <Grid xs={12} md={12} item>
                                                  <Field
                                                    as={TextField}
                                                    name={`chatbots[${index}].greetingMessage`}
                                                    label={i18n.t("queueModal.form.message")}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                    multiline
                                                    error={
                                                      touched.greetingMessage &&
                                                      Boolean(errors.greetingMessage)
                                                    }
                                                    helperText={
                                                      touched.greetingMessage &&
                                                      errors.greetingMessage
                                                    }
                                                    className={classes.textField}
                                                  />
                                                </Grid>
                                              )}
                                            </div>
                                            {queue.chatbots[index].queueType === "queue" && (
                                              <>
                                                <Grid xs={12} md={12} item>
                                                  <Field
                                                    as={TextField}
                                                    name={`chatbots[${index}].greetingMessage`}
                                                    label={i18n.t("queueModal.form.message")}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                    multiline
                                                    error={
                                                      touched.greetingMessage &&
                                                      Boolean(errors.greetingMessage)
                                                    }
                                                    helperText={
                                                      touched.greetingMessage &&
                                                      errors.greetingMessage
                                                    }
                                                    className={classes.textField}
                                                  />
                                                </Grid>
                                                <Grid xs={12} md={8} item>
                                                  <FormControl
                                                    variant="outlined"
                                                    margin="dense"
                                                    className={classes.FormControl}
                                                    fullWidth
                                                  >
                                                    <InputLabel id="queue-selection-label">{i18n.t("queueModal.form.queue")}</InputLabel>
                                                    <Field
                                                      as={Select}
                                                      name={`chatbots[${index}].optQueueId`}
                                                      error={touched?.chatbots?.[index]?.optQueueId &&
                                                        Boolean(errors?.chatbots?.[index]?.optQueueId)}
                                                      helpertext={touched?.chatbots?.[index]?.optQueueId && errors?.chatbots?.[index]?.optQueueId}
                                                      className={classes.textField1}
                                                    >
                                                      {queues.map(queue => (
                                                        <MenuItem key={queue.id} value={queue.id}>
                                                          {queue.name}
                                                        </MenuItem>
                                                      ))}
                                                    </Field>
                                                  </FormControl>
                                                </Grid>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "attendent" && (
                                              <>
                                                <Grid xs={12} md={12} item>
                                                  <Field
                                                    as={TextField}
                                                    name={`chatbots[${index}].greetingMessage`}
                                                    label={i18n.t("queueModal.form.message")}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                    multiline
                                                    error={
                                                      touched.greetingMessage &&
                                                      Boolean(errors.greetingMessage)
                                                    }
                                                    helperText={
                                                      touched.greetingMessage &&
                                                      errors.greetingMessage
                                                    }
                                                    className={classes.textField}
                                                  />
                                                </Grid>
                                                <Grid xs={12} md={4} item>
                                                  <Autocomplete
                                                    style={{ marginTop: '8px' }}
                                                    variant="outlined"
                                                    margin="dense"
                                                    getOptionLabel={(option) => `${option.name}`}
                                                    value={queue.chatbots[index].user}
                                                    onChange={(e, newValue) => {
                                                      if (newValue != null) {
                                                        setFieldValue(`chatbots[${index}].optUserId`, newValue.id);
                                                      } else {
                                                        setFieldValue(`chatbots[${index}].optUserId`, null);
                                                      }
                                                      if (newValue != null && Array.isArray(newValue.queues)) {
                                                        if (newValue.queues.length === 1) {
                                                          setSelectedQueueOption(newValue.queues[0].id);
                                                          setFieldValue(`chatbots[${index}].optQueueId`, newValue.queues[0].id);
                                                        }
                                                        setQueues(newValue.queues);
                                                      } else {
                                                        setQueues(allQueues);
                                                        setSelectedQueueOption("");
                                                      }
                                                    }}
                                                    options={userOptions}
                                                    filterOptions={filterOptions}
                                                    freeSolo
                                                    fullWidth
                                                    autoHighlight
                                                    noOptionsText={i18n.t("transferTicketModal.noOptions")}
                                                    loading={loading}
                                                    size="small"
                                                    renderOption={option => (<span> <UserStatusIcon user={option} /> {option.name}</span>)}
                                                    renderInput={(params) => (
                                                      <TextField
                                                        {...params}
                                                        label={i18n.t("transferTicketModal.fieldLabel")}
                                                        variant="outlined"
                                                        onChange={(e) => setSearchParam(e.target.value)}
                                                        InputProps={{
                                                          ...params.InputProps,
                                                          endAdornment: (
                                                            <Fragment>
                                                              {loading ? (
                                                                <CircularProgress color="inherit" size={20} />
                                                              ) : null}
                                                              {params.InputProps.endAdornment}
                                                            </Fragment>
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
                                                      value={selectedQueueOption}
                                                      onChange={(e) => {
                                                        setSelectedQueueOption(e.target.value)
                                                        setFieldValue(`chatbots[${index}].optQueueId`, e.target.value);
                                                      }}
                                                      label={i18n.t("transferTicketModal.fieldQueuePlaceholder")}
                                                    >
                                                      {queues.map((queue) => (
                                                        <MenuItem key={queue.id} value={queue.id}>
                                                          {queue.name}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                                </Grid>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "integration" && (
                                              <>
                                                <Grid xs={12} md={12} item>
                                                  <Field
                                                    as={TextField}
                                                    name={`chatbots[${index}].greetingMessage`}
                                                    label={i18n.t("queueModal.form.message")}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                    multiline
                                                    error={
                                                      touched.greetingMessage &&
                                                      Boolean(errors.greetingMessage)
                                                    }
                                                    helperText={
                                                      touched.greetingMessage &&
                                                      errors.greetingMessage
                                                    }
                                                    className={classes.textField}
                                                  />
                                                </Grid>
                                                <Grid xs={12} md={8} item>
                                                  <FormControl
                                                    variant="outlined"
                                                    margin="dense"
                                                    className={classes.FormControl}
                                                    fullWidth
                                                  >
                                                    <InputLabel id="optIntegrationId-selection-label">{i18n.t("queueModal.form.integration")}</InputLabel>
                                                    <Field
                                                      as={Select}
                                                      name={`chatbots[${index}].optIntegrationId`}
                                                      error={touched?.chatbots?.[index]?.optIntegrationId &&
                                                        Boolean(errors?.chatbots?.[index]?.optIntegrationId)}
                                                      helpertext={touched?.chatbots?.[index]?.optIntegrationId && errors?.chatbots?.[index]?.optIntegrationId}
                                                      className={classes.textField1}
                                                    >
                                                      {integrations.map(integration => (
                                                        <MenuItem key={integration.id} value={integration.id}>
                                                          {integration.name}
                                                        </MenuItem>
                                                      ))}
                                                    </Field>
                                                  </FormControl>
                                                </Grid>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "file" && (
                                              <>
                                                <Grid xs={12} md={12} item>
                                                  <Field
                                                    as={TextField}
                                                    name={`chatbots[${index}].greetingMessage`}
                                                    label={i18n.t("queueModal.form.message")}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                    multiline
                                                    error={
                                                      touched.greetingMessage &&
                                                      Boolean(errors.greetingMessage)
                                                    }
                                                    helperText={
                                                      touched.greetingMessage &&
                                                      errors.greetingMessage
                                                    }
                                                    className={classes.textField}
                                                  />
                                                </Grid>
                                                <InputLabel>{"Selecione um Arquivo"}</InputLabel>
                                                <Field
                                                  as={Select}
                                                  name={`chatbots[${index}].optFileId`}
                                                  error={touched?.chatbots?.[index]?.optFileId &&
                                                    Boolean(errors?.chatbots?.[index]?.optFileId)}
                                                  helpertext={touched?.chatbots?.[index]?.optFileId && errors?.chatbots?.[index]?.optFileId}
                                                  className={classes.textField1}
                                                >
                                                  {file.map(f => (
                                                    <MenuItem key={f.id} value={f.id}>
                                                      {f.name}
                                                    </MenuItem>
                                                  ))}
                                                </Field>
                                              </>
                                            )}
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                handleSaveBot(values)
                                              }
                                              disabled={isSubmitting}
                                            >
                                              {" "}
                                              <SaveIcon />
                                            </IconButton>
                                          </Grid>
                                        )}

                                        <OptionsChatBot chatBotId={info.id} />
                                      </>
                                    </StepContent>
                                  )}
                                </Step>
                              ))}

                            <Step>
                              <StepLabel
                                onClick={() => push({ name: "", value: "" })}
                              >
                                {i18n.t("queueModal.bot.addOptions")}
                              </StepLabel>
                            </Step>
                          </Stepper>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
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
                  >
                    {i18n.t("queueModal.buttons.cancel")}
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    type="submit"
                    style={{
                      color: "white",
                      backgroundColor: "#437db5",
                      boxShadow: "none",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                    disabled={isSubmitting}
                    variant="contained"
                    className={classes.btnWrapper}
                  >
                    {queueId
                      ? `${i18n.t("queueModal.buttons.okEdit")}`
                      : `${i18n.t("queueModal.buttons.okAdd")}`}
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
        )}
        {tab === 1 && (
          <Paper style={{ padding: 0 }}>
            {renderSchedulesTab()}
          </Paper>
        )}
      </Dialog>
    </div>
  );
};

export default QueueModal;