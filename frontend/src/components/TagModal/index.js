import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green, orange, blue, red, purple, deepPurple } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Colorize, Palette, Gradient } from "@material-ui/icons";
import { ColorBox } from "material-ui-color";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { 
  FormControl, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  Select,
  Typography,
  Popover,
  Grid,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { Slide } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

// Criação de um tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: orange[500],
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h6: {
      fontWeight: 600,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  dialogPaper: {
    borderRadius: "8px",
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.25)",
    background: "linear-gradient(145deg, #ffffff, #f8f8f8)",
    minWidth: "500px",
    maxWidth: "800px",
    overflow: "hidden",
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      minWidth: "95%",
      maxWidth: "95%",
      margin: theme.spacing(1),
    },
  },
  dialogTitle: {
    background: "#3f51b5",
    color: "white",
    padding: "16px 20px",
    borderRadius: "8px 8px 0 0",
    textAlign: "center",
    fontSize: "1.25rem",
    fontWeight: 600,
    cursor: "move",
    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
    letterSpacing: "0.5px",
    position: "relative",
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: "12px 16px",
      fontSize: "1.1rem",
    },
  },
  dialogContent: {
    padding: "20px",
    position: "relative",
    zIndex: 1,
    background: "rgba(255,255,255,0.9)",
    [theme.breakpoints.down('sm')]: {
      padding: "16px",
    },
  },
  dialogActions: {
    padding: "12px 20px",
    borderTop: "1px solid rgba(0,0,0,0.05)",
    background: "linear-gradient(to right, #f5f7fa, #e4e8f0)",
    borderRadius: "0 0 8px 8px",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      gap: theme.spacing(1),
      padding: "12px",
    },
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > *:not(:last-child)': {
        marginRight: 0,
        marginBottom: theme.spacing(2),
      },
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
    margin: theme.spacing(1, 0),
    minWidth: 120,
    background: "rgba(255,255,255,0.8)",
    borderRadius: "8px",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  colorAdorment: {
    width: 24,
    height: 24,
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cancelButton: {
    background: "linear-gradient(45deg, #ff5e62 0%, #ff9966 100%)",
    color: "white",
    boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    padding: "8px 20px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  saveButton: {
    background: "linear-gradient(45deg, #2196F3 0%, #21CBF3 100%)",
    color: "white",
    boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    padding: "8px 20px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "rgba(255,255,255,0.9)",
      "&:hover fieldset": {
        borderColor: deepPurple[300],
      },
      "&.Mui-focused fieldset": {
        borderColor: deepPurple[500],
        boxShadow: `0 0 0 2px ${deepPurple[100]}`,
      },
    },
    "& .MuiInputLabel-outlined": {
      color: deepPurple[800],
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: deepPurple[600],
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  colorPickerPopover: {
    marginTop: theme.spacing(1),
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    border: `1px solid ${deepPurple[100]}`,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      left: '5% !important',
    },
  },
  colorPickerContainer: {
    padding: theme.spacing(2),
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  sectionTitle: {
    color: deepPurple[700],
    fontWeight: 600,
    margin: "16px 0 8px 0",
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: "8px",
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      margin: "12px 0 6px 0",
    },
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.05,
    zIndex: 0,
    backgroundImage: "radial-gradient(#764ba2 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  // Novas classes para a barra de rolagem
  scrollableContent: {
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
        background: '#555',
      },
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'calc(100vh - 180px)',
    },
  },
  fixedActions: {
    position: 'sticky',
    bottom: 0,
    background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
    zIndex: 2,
  },
}));

const TagSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Mensagem muito curta")
    .required("Obrigatório"),
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DraggablePaper = (props) => (
  <Draggable
    handle="#draggable-dialog-title"
    cancel={'[class*="MuiDialogContent-root"], [class*="MuiDialogActions-root"]'}
    bounds="parent"
  >
    <Paper {...props} />
  </Draggable>
);

const TagModal = ({ open, onClose, tagId, kanban }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLane, setSelectedLane] = useState([]);
  const [selectedRollbackLane, setSelectedRollbackLane] = useState([]);
  
  const initialState = {
    name: "",
    color: getRandomHexColor(),
    kanban: kanban,
    timeLane: 0,
    nextLaneId: 0,
    greetingMessageLane: "",
    rollbackLaneId: 0,
  };
  const [tag, setTag] = useState(initialState);

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleColorChange = (val) => {
    setTag((prev) => ({
      ...prev,
      color: `#${val.hex}`,
    }));
  };

  const colorPickerOpen = Boolean(colorAnchorEl);
  const colorPickerId = colorPickerOpen ? 'color-picker-popover' : undefined;

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTags = async () => {
        try {
          const { data } = await api.get("/tags/", {
            params: { kanban: 1, tagId },
          });
          setLanes(data.tags);
        } catch (err) {
          toastError(err);
        }
      };
      fetchTags();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  useEffect(() => {
    try {
      (async () => {
        if (!tagId) return;
        const { data } = await api.get(`/tags/${tagId}`);
        setTag((prevState) => {
          return { ...prevState, ...data };
        });
        if (data.nextLaneId) {
          setSelectedLane(data.nextLaneId);
        }
        if (data.rollbackLaneId) {
          setSelectedRollbackLane(data.rollbackLaneId);
        }
      })();
    } catch (err) {
      toastError(err);
    }
  }, [tagId, open]);

  const handleClose = () => {
    setTag(initialState);
    setColorAnchorEl(null);
    onClose();
  };

  const handleSaveTag = async (values) => {
    const tagData = {
      ...values,
      userId: user?.id,
      kanban: kanban,
      nextLaneId: selectedLane || null,
      rollbackLaneId: selectedRollbackLane || null,
    };
    try {
      if (tagId) {
        await api.put(`/tags/${tagId}`, tagData);
      } else {
        await api.post("/tags", tagData);
      }
      toast.success(
        kanban === 0
          ? `${i18n.t("tagModal.success")}`
          : `${i18n.t("tagModal.successKanban")}`
      );
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  function getRandomHexColor() {
    const colors = ['#667eea', '#764ba2', '#6B8DD6', '#8E37D7', '#5F72BE', '#9F7AEA', '#667EEA'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          scroll="paper"
          disableBackdropClick
          disableEscapeKeyDown
          classes={{ paper: classes.dialogPaper }}
          PaperComponent={isMobile ? Paper : DraggablePaper}
          TransitionComponent={Transition}
          fullScreen={isMobile}
        >
          <div className={classes.backgroundPattern} />
          
          <DialogTitle 
            className={classes.dialogTitle}
            id={isMobile ? undefined : "draggable-dialog-title"}
          >
            {tagId
              ? kanban === 0
                ? `${i18n.t("tagModal.title.edit")}`
                : `${i18n.t("tagModal.title.editKanban")}`
              : kanban === 0
              ? `${i18n.t("tagModal.title.add")}`
              : `${i18n.t("tagModal.title.addKanban")}`}
          </DialogTitle>
          
          <Formik
            initialValues={tag}
            enableReinitialize={true}
            validationSchema={TagSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveTag(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting, values }) => (
              <Form>
                <div className={classes.scrollableContent}>
                  <DialogContent className={classes.dialogContent}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" className={classes.sectionTitle}>
                          <Palette /> Informações Básicas
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          label={i18n.t("tagModal.form.name")}
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
                                <Gradient style={{ color: deepPurple[300] }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          fullWidth
                          label={i18n.t("tagModal.form.color")}
                          name="color"
                          id="color"
                          error={touched.color && Boolean(errors.color)}
                          helperText={touched.color && errors.color}
                          className={classes.inputField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <div
                                  style={{ 
                                    backgroundColor: values.color,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                  }}
                                  className={classes.colorAdorment}
                                ></div>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <IconButton
                                size="small"
                                color="default"
                                onClick={handleColorClick}
                                style={{ color: deepPurple[500] }}
                                aria-describedby={colorPickerId}
                              >
                                <Colorize />
                              </IconButton>
                            ),
                          }}
                          variant="outlined"
                          margin="dense"
                        />
                        <Popover
                          id={colorPickerId}
                          open={colorPickerOpen}
                          anchorEl={colorAnchorEl}
                          onClose={handleColorClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          className={classes.colorPickerPopover}
                        >
                          <div className={classes.colorPickerContainer}>
                            <ColorBox
                              disableAlpha={true}
                              hslGradient={false}
                              value={tag.color}
                              onChange={handleColorChange}
                            />
                          </div>
                        </Popover>
                      </Grid>
                      
                      {kanban === 1 && (
                        <>
                          <Grid item xs={12}>
                            <Typography variant="h6" className={classes.sectionTitle}>
                              <Gradient /> Configurações de Kanban
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Field
                              as={TextField}
                              label={i18n.t("tagModal.form.timeLane")}
                              name="timeLane"
                              error={touched.timeLane && Boolean(errors.timeLane)}
                              helperText={touched.timeLane && errors.timeLane}
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              className={classes.inputField}
                              type="number"
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <FormControl
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              className={`${classes.formControl} ${classes.inputField}`}
                            >
                              <InputLabel id="nextLaneId-label">
                                {i18n.t("tagModal.form.nextLaneId")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("tagModal.form.nextLaneId")}
                                labelId="nextLaneId-label"
                                id="nextLaneId"
                                name="nextLaneId"
                                error={touched.nextLaneId && Boolean(errors.nextLaneId)}
                                value={selectedLane}
                                onChange={(e) => setSelectedLane(e.target.value || null)}
                              >
                                <MenuItem value={null}>&nbsp;</MenuItem>
                                {lanes.map((lane) => (
                                  <MenuItem key={lane.id} value={lane.id}>
                                    {lane.name}
                                  </MenuItem>
                                ))}
                              </Field>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Field
                              as={TextField}
                              label={i18n.t("tagModal.form.greetingMessageLane")}
                              name="greetingMessageLane"
                              rows={isMobile ? 3 : 5}
                              multiline
                              error={
                                touched.greetingMessageLane &&
                                Boolean(errors.greetingMessageLane)
                              }
                              helperText={
                                touched.greetingMessageLane && errors.greetingMessageLane
                              }
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              className={classes.inputField}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <FormControl
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              className={`${classes.formControl} ${classes.inputField}`}
                            >
                              <InputLabel id="rollbackLaneId-label">
                                {i18n.t("tagModal.form.rollbackLaneId")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("tagModal.form.rollbackLaneId")}
                                labelId="rollbackLaneId-label"
                                id="rollbackLaneId"
                                name="rollbackLaneId"
                                error={
                                  touched.rollbackLaneId && Boolean(errors.rollbackLaneId)
                                }
                                value={selectedRollbackLane}
                                onChange={(e) => setSelectedRollbackLane(e.target.value)}
                              >
                                <MenuItem value={null}>&nbsp;</MenuItem>
                                {lanes.map((lane) => (
                                  <MenuItem key={lane.id} value={lane.id}>
                                    {lane.name}
                                  </MenuItem>
                                ))}
                              </Field>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </DialogContent>
                </div>
                
                <DialogActions className={`${classes.dialogActions} ${classes.fixedActions}`}>
                  <Button
                    onClick={handleClose}
                    startIcon={<CancelIcon />}
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
                    {i18n.t("tagModal.buttons.cancel")}
                  </Button>
                  
                  <Button
                    type="submit"
                    startIcon={<SaveIcon />}
                    style={{
                      color: "white",
                      backgroundColor: "#437db5",
                      boxShadow: "none",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {tagId
                      ? `${i18n.t("tagModal.buttons.okEdit")}`
                      : `${i18n.t("tagModal.buttons.okAdd")}`}
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
    </ThemeProvider>
  );
};

export default TagModal;