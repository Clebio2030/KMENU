import React, { useState, useEffect, useContext, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green, purple, deepPurple, blue, grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Slide from '@material-ui/core/Slide';
import whatsappIcon from '../../assets/nopicture.png';
import { i18n } from "../../translate/i18n";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import useWhatsApps from "../../hooks/useWhatsApps";
import { Can } from "../Can";
import { Avatar, Grid, Input, Paper, Tab, Tabs, Typography, InputAdornment } from "@material-ui/core";
import { getBackendUrl } from "../../config";
import TabPanel from "../TabPanel";
import AvatarUploader from "../AvatarUpload";

const backendUrl = getBackendUrl();
const path = require('path');

const useStyles = makeStyles(theme => ({
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
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2),
    cursor: 'pointer',
    borderRadius: '50%',
    border: `2px solid ${deepPurple[300]}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  updateDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateInput: {
    display: 'none',
  },
  updateLabel: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textTransform: 'uppercase',
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid #ccc',
    borderRadius: '5px',
    minWidth: 160,
    fontWeight: 'bold',
    color: '#555',
  },
  errorUpdate: {
    border: '2px solid red',
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  dialog: {
    borderRadius: '8px',
    boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    width: '90vw',
    maxWidth: '1000px',
    height: '90vh',
    maxHeight: '800px',
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: 'white',
    padding: theme.spacing(1.5, 3),
    borderBottom: `1px solid ${deepPurple[100]}`,
    display: 'flex',
    alignItems: 'center',
    minHeight: '60px',
  },
  titleContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  titleIcon: {
    fontSize: '1.2rem',
  },
  dialogContent: {
    padding: theme.spacing(4),
    backgroundColor: '#f9f9ff',
    overflowY: 'auto',
    height: 'calc(100% - 120px)',
  },
  dialogActions: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
    borderTop: `1px solid ${grey[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    position: 'sticky',
    bottom: 0,
  },
  tab: {
    backgroundColor: 'transparent',
    color: grey[700],
    fontWeight: 600,
    minHeight: 48,
    '&.Mui-selected': {
      color: deepPurple[500],
      fontWeight: 700,
    },
  },
  tabIndicator: {
    backgroundColor: deepPurple[500],
    height: 3,
  },
  tabPanel: {
    padding: theme.spacing(3, 0),
    height: '100%',
    overflowY: 'auto',
  },
  sectionTitle: {
    color: deepPurple[500],
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  avatarActions: {
    marginTop: theme.spacing(1),
    display: 'flex',
    gap: theme.spacing(1),
  },
  deleteButton: {
    color: "white",
    backgroundColor: "#db6565",
    boxShadow: "none",
    borderRadius: 0,
    fontSize: "12px",
  },
  saveButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 600,
    padding: '8px 24px',
    borderRadius: '8px',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd1 0%, #6a3d9a 100%)',
    },
  },
  cancelButton: {
    color: grey[600],
    fontWeight: 600,
    border: `1px solid ${grey[300]}`,
    padding: '8px 24px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: grey[100],
    },
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: grey[300],
      },
      '&:hover fieldset': {
        borderColor: deepPurple[300],
      },
      '&.Mui-focused fieldset': {
        borderColor: deepPurple[500],
      },
    },
  },
  selectField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  },
  timePicker: {
    '& .MuiOutlinedInput-input': {
      padding: '13.5px 14px',
    },
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  inputIcon: {
    color: deepPurple[500],
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserModal = ({ open, onClose, userId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "user",
    startWork: "00:00",
    endWork: "23:59",
    farewellMessage: "",
    allTicket: "disable",
    allowGroup: false,
    defaultTheme: "light",
    defaultMenu: "open",
    allHistoric: "disabled",
    allUserChat: "disabled",
    userClosePendingTicket: "enabled",
    showDashboard: "disabled",
    allowRealTime: "disabled",
    allowConnections: "disabled",
  };

  const { user: loggedInUser } = useContext(AuthContext);

  const [user, setUser] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [whatsappId, setWhatsappId] = useState(false);
  const { loading, whatsApps } = useWhatsApps();
  const [profileUrl, setProfileUrl] = useState(null);
  const [tab, setTab] = useState("general");
  const [avatar, setAvatar] = useState(null);
  const startWorkRef = useRef();
  const endWorkRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(prevState => {
          return { ...prevState, ...data, password: "", confirmPassword: "" };
        });

        const { profileImage } = data;
        setProfileUrl(`${backendUrl}/public/company${data.companyId}/user/${profileImage}`);

        const userQueueIds = data.queues?.map(queue => queue.id);
        setSelectedQueueIds(userQueueIds);
        setWhatsappId(data.whatsappId ? data.whatsappId : '');
      } catch (err) {
        toastError(err);
      }
    };

    fetchUser();
  }, [userId, open]);

  const handleClose = () => {
    onClose();
    setUser(initialState);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSaveUser = async (values) => {
    const uploadAvatar = async (file) => {
      const formData = new FormData();
      formData.append('userId', file.id);
      formData.append('typeArch', "user");
      formData.append('profileImage', avatar);

      const { data } = await api.post(`/users/${file.id}/media-upload`, formData);

      localStorage.setItem("profileImage", data.user.profileImage);
    };

    const userData = userId && !values.password 
      ? {
          ...values,
          whatsappId,
          queueIds: selectedQueueIds,
          password: undefined,
          confirmPassword: undefined
        }
      : {
          ...values,
          whatsappId,
          queueIds: selectedQueueIds
        };

    try {
      if (userId) {
        const { data } = await api.put(`/users/${userId}`, userData);
        if (avatar && (!user?.profileImage || !user?.profileImage !== avatar.name)) {
          uploadAvatar(data);
        }
      } else {
        await api.post("/users", userData);
        if (!user?.profileImage && avatar) {
          uploadAvatar(user);
        }
      }
      if (userId === loggedInUser.id) {
        handleClose();
        toast.success(i18n.t("userModal.success"));
        window.location.reload();
      } else {
        handleClose();
        toast.success(i18n.t("userModal.success"));
      }
    } catch (err) {
      toastError(err);
    }
  };

  const getValidationSchema = () => {
    const baseSchema = {
      name: Yup.string()
        .min(2, "Curto!")
        .max(50, "Longo!")
        .required("Obrigatório"),
      email: Yup.string()
        .email("Email Inválido")
        .required("Obrigatório"),
    };

    if (!userId) {
      return Yup.object().shape({
        ...baseSchema,
        password: Yup.string()
          .min(5, "Senha muito curta")
          .required("Senha é Obrigatório"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], "As senhas não correspondem")
          .required("Confirme sua senha"),
      });
    } else {
      return Yup.object().shape({
        ...baseSchema,
        password: Yup.string()
          .min(5, "Senha muito curta")
          .nullable()
          .notRequired(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], "As senhas não correspondem")
          .when('password', {
            is: (val) => val && val.length > 0,
            then: Yup.string().required('Confirme sua senha'),
            otherwise: Yup.string().notRequired()
          }),
      });
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        scroll="paper"
        classes={{ paper: classes.dialog }}
        TransitionComponent={Transition}
      >
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
          <div className={classes.titleContent}>
            <PersonIcon className={classes.titleIcon} />
            <Typography variant="h6" style={{ fontWeight: 700 }}>
              {userId
                ? `${i18n.t("userModal.title.edit")}`
                : `${i18n.t("userModal.title.add")}`}
            </Typography>
          </div>
        </DialogTitle>
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={getValidationSchema()}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveUser(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, setFieldValue }) => (
            <Form className={classes.formContainer}>
              <DialogContent dividers className={classes.dialogContent}>
                <Tabs
                  value={tab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleTabChange}
                  aria-label="user form tabs"
                  classes={{
                    indicator: classes.tabIndicator,
                  }}
                >
                  <Tab 
                    label={i18n.t("userModal.tabs.general")} 
                    value={"general"} 
                    className={classes.tab}
                    icon={<SettingsIcon fontSize="small" />}
                  />
                  <Tab 
                    label={i18n.t("userModal.tabs.permissions")} 
                    value={"permissions"} 
                    className={classes.tab}
                    icon={<SecurityIcon fontSize="small" />}
                  />
                </Tabs>

                <TabPanel
                  className={classes.tabPanel}
                  value={tab}
                  name={"general"}
                >
                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <PersonIcon fontSize="small" /> Informações do Perfil
                    </Typography>
                    
                    <div className={classes.avatarContainer}>
                      <AvatarUploader
                        setAvatar={setAvatar}
                        avatar={user.profileImage}
                        companyId={user.companyId}
                        className={classes.avatar}
                      />
                      {user.profileImage && (
                        <div className={classes.avatarActions}>
                          <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            style={{
                            color: "white",
                            backgroundColor: "#db6565",
                            boxShadow: "none",
                            borderRadius: "5px",
                            fontSize: "12px",
                            }}
                            size="small"
                            onClick={() => {
                              user.profileImage = null;
                              setFieldValue("profileImage", null);
                              setAvatar(null);
                            }}
                          >
                            {i18n.t("userModal.title.removeImage")}
                          </Button>
                        </div>
                      )}
                    </div>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Field
                          as={TextField}
                          label={i18n.t("userModal.form.name")}
                          name="name"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.inputField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon className={classes.inputIcon} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Field
                          as={TextField}
                          label={i18n.t("userModal.form.email")}
                          name="email"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.inputField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon className={classes.inputIcon} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          className={classes.selectField}
                        >
                          <Can
                            role={loggedInUser.profile}
                            perform="user-modal:editProfile"
                            yes={() => (
                              <>
                                <InputLabel id="profile-selection-input-label">
                                  {i18n.t("userModal.form.profile")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.profile")}
                                  name="profile"
                                  labelId="profile-selection-label"
                                  id="profile-selection"
                                  required
                                  startAdornment={
                                    <InputAdornment position="start">
                                      <SecurityIcon className={classes.inputIcon} />
                                    </InputAdornment>
                                  }
                                >
                                  <MenuItem value="admin">Admin</MenuItem>
                                  <MenuItem value="user">User</MenuItem>
                                </Field>
                              </>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} style={{ marginTop: 8 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Field
                          as={TextField}
                          label={i18n.t("userModal.form.password")}
                          type="password"
                          name="password"
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          placeholder={userId ? "Deixe em branco para manter a senha atual" : ""}
                          className={classes.inputField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon className={classes.inputIcon} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Field
                          as={TextField}
                          label={i18n.t("Confirme sua senha")}
                          type="password"
                          name="confirmPassword"
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          placeholder={userId ? "Deixe em branco para manter a senha atual" : ""}
                          className={classes.inputField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon className={classes.inputIcon} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Can
                          role={loggedInUser.profile}
                          perform="user-modal:editProfile"
                          yes={() => (
                            <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                              <InputLabel>
                                {i18n.t("userModal.form.defaultMenu")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("userModal.form.defaultMenu")}
                                name="defaultMenu"
                                type="defaultMenu"
                                required
                              >
                                <MenuItem value={"open"}>{i18n.t("userModal.form.defaultMenuOpen")}</MenuItem>
                                <MenuItem value={"closed"}>{i18n.t("userModal.form.defaultMenuClosed")}</MenuItem>
                              </Field>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <GroupIcon fontSize="small" /> Configuração de Filas e Conexão
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Can
                          role={loggedInUser.profile}
                          perform="user-modal:editQueues"
                          yes={() => (
                            <QueueSelect
                              selectedQueueIds={selectedQueueIds}
                              onChange={values => setSelectedQueueIds(values)}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Can
                          role={loggedInUser.profile}
                          perform="user-modal:editProfile"
                          yes={() => (
                            <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                              <InputLabel>
                                {i18n.t("userModal.form.whatsapp")}
                              </InputLabel>
                              <Field
                                as={Select}
                                value={whatsappId}
                                onChange={(e) => setWhatsappId(e.target.value)}
                                label={i18n.t("userModal.form.whatsapp")}
                              >
                                <MenuItem value={''}>&nbsp;</MenuItem>
                                {whatsApps.map((whatsapp) => (
                                  <MenuItem key={whatsapp.id} value={whatsapp.id}>{whatsapp.name}</MenuItem>
                                ))}
                              </Field>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <WorkIcon fontSize="small" /> Jornada de Trabalho
                    </Typography>
                    
                    <Can
                      role={loggedInUser.profile}
                      perform="user-modal:editProfile"
                      yes={() => (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              label={i18n.t("userModal.form.startWork")}
                              type="time"
                              ampm={false}
                              inputRef={startWorkRef}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                step: 600,
                              }}
                              fullWidth
                              name="startWork"
                              error={touched.startWork && Boolean(errors.startWork)}
                              helperText={touched.startWork && errors.startWork}
                              variant="outlined"
                              margin="dense"
                              className={classes.timePicker}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <ScheduleIcon className={classes.inputIcon} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              label={i18n.t("userModal.form.endWork")}
                              type="time"
                              ampm={false}
                              inputRef={endWorkRef}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                step: 600,
                              }}
                              fullWidth
                              name="endWork"
                              error={touched.endWork && Boolean(errors.endWork)}
                              helperText={touched.endWork && errors.endWork}
                              variant="outlined"
                              margin="dense"
                              className={classes.timePicker}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <ScheduleIcon className={classes.inputIcon} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    />
                  </Paper>

                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <MessageIcon fontSize="small" /> Configurações Adicionais
                    </Typography>
                    
                    <Field
                      as={TextField}
                      label={i18n.t("userModal.form.farewellMessage")}
                      type="farewellMessage"
                      multiline
                      rows={4}
                      fullWidth
                      name="farewellMessage"
                      error={touched.farewellMessage && Boolean(errors.farewellMessage)}
                      helperText={touched.farewellMessage && errors.farewellMessage}
                      variant="outlined"
                      margin="dense"
                      className={classes.inputField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MessageIcon className={classes.inputIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                </TabPanel>

                <TabPanel
                  className={classes.tabPanel}
                  value={tab}
                  name={"permissions"}
                >
                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <SecurityIcon fontSize="small" /> Permissões de Ticket
                    </Typography>
                    
                    <Can
                      role={loggedInUser.profile}
                      perform="user-modal:editProfile"
                      yes={() =>
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allTicket")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allTicket")}
                                  name="allTicket"
                                  type="allTicket"
                                  required
                                >
                                  <MenuItem value="enable">{i18n.t("userModal.form.allTicketEnable")}</MenuItem>
                                  <MenuItem value="disable">{i18n.t("userModal.form.allTicketDisable")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allowGroup")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allowGroup")}
                                  name="allowGroup"
                                  type="allowGroup"
                                  required
                                >
                                  <MenuItem value={true}>{i18n.t("userModal.form.allTicketEnable")}</MenuItem>
                                  <MenuItem value={false}>{i18n.t("userModal.form.allTicketDisable")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.userClosePendingTicket")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.userClosePendingTicket")}
                                  name="userClosePendingTicket"
                                  type="userClosePendingTicket"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </>
                      }
                    />
                  </Paper>

                  <Paper elevation={0} className={classes.card}>
                    <Typography className={classes.sectionTitle}>
                      <DashboardIcon fontSize="small" /> Permissões de acesso
                    </Typography>
                    
                    <Can
                      role={loggedInUser.profile}
                      perform="user-modal:editProfile"
                      yes={() =>
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allHistoric")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allHistoric")}
                                  name="allHistoric"
                                  type="allHistoric"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allUserChat")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allUserChat")}
                                  name="allUserChat"
                                  type="allUserChat"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.showDashboard")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.showDashboard")}
                                  name="showDashboard"
                                  type="showDashboard"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} style={{ marginTop: 8 }}>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allowRealTime")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allowRealTime")}
                                  name="allowRealTime"
                                  type="allowRealTime"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl variant="outlined" margin="dense" fullWidth className={classes.selectField}>
                                <InputLabel>
                                  {i18n.t("userModal.form.allowConnections")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("userModal.form.allowConnections")}
                                  name="allowConnections"
                                  type="allowConnections"
                                  required
                                >
                                  <MenuItem value="disabled">{i18n.t("userModal.form.allHistoricDisabled")}</MenuItem>
                                  <MenuItem value="enabled">{i18n.t("userModal.form.allHistoricEnabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </>
                      }
                    />
                  </Paper>
                </TabPanel>
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
                  {i18n.t("userModal.buttons.cancel")}
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
                >
                  {userId
                    ? `${i18n.t("userModal.buttons.okEdit")}`
                    : `${i18n.t("userModal.buttons.okAdd")}`}
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
    </div>
  );
};

export default UserModal;