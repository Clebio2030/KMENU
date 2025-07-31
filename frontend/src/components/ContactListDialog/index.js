import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { green, blue, red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Slide, Fade, Zoom } from "@material-ui/core";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";

// Transition component para o efeito de slide
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
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.25)",
    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
    minWidth: "450px",
    maxWidth: "600px",
    overflow: "hidden",
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "16px 24px",
    textAlign: "left",
    fontSize: "1.2rem",
    fontWeight: "500",
    cursor: "move",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  dialogContent: {
    padding: "28px",
    background: "#f9fafc",
  },
  dialogActions: {
    padding: "16px 28px",
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
  },
  multFieldLine: {
    display: "flex",
    marginBottom: theme.spacing(2),
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
  cancelButton: {
    background: `linear-gradient(45deg, ${red[500]} 0%, ${red[700]} 100%)`,
    color: "white",
    borderRadius: "8px",
    padding: "8px 20px",
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 10px rgba(219, 101, 101, 0.3)",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(219, 101, 101, 0.4)",
    },
  },
  saveButton: {
    background: `linear-gradient(45deg, ${blue[500]} 0%, ${blue[700]} 100%)`,
    color: "white",
    borderRadius: "8px",
    padding: "8px 24px",
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 10px rgba(67, 125, 181, 0.3)",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(67, 125, 181, 0.4)",
    },
  },
  inputIcon: {
    color: "#667eea",
    marginRight: theme.spacing(1),
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
        boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "#6b7280",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#667eea",
    },
  },
  titleContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  }
}));

const ContactListSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Curto!")
    .max(50, "Longo!")
    .required("Obrigatório"),
});

// Componente para tornar a janela arrastável
const DraggablePaper = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const ContactListModal = ({ open, onClose, contactListId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
  };

  const [contactList, setContactList] = useState(initialState);

  useEffect(() => {
    const fetchContactList = async () => {
      if (!contactListId) return;
      try {
        const { data } = await api.get(`/contact-lists/${contactListId}`);
        setContactList((prevState) => {
          return { ...prevState, ...data };
        });
      } catch (err) {
        toastError(err);
      }
    };

    fetchContactList();
  }, [contactListId, open]);

  const handleClose = () => {
    onClose();
    setContactList(initialState);
  };

  const handleSaveContactList = async (values) => {
    const contactListData = { ...values };
    try {
      if (contactListId) {
        await api.put(`/contact-lists/${contactListId}`, contactListData);
        toast.success(i18n.t("contactLists.toasts.updated"));
      } else {
        await api.post("/contact-lists", contactListData);
        toast.success(i18n.t("contactLists.toasts.created"));
      }
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        maxWidth="xs"
        fullWidth
        scroll="paper"
        TransitionComponent={Transition}
        classes={{ paper: classes.dialogPaper }}
        PaperComponent={DraggablePaper}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="draggable-dialog-title" className={classes.dialogTitle}>
          <Zoom in={true} style={{ transitionDelay: open ? '100ms' : '0ms' }}>
            <div className={classes.titleContent}>
              {contactListId ? (
                <>
                  <EditIcon style={{ marginRight: 8 }} />
                  {i18n.t("contactLists.dialog.edit")}
                </>
              ) : (
                <>
                  <PersonAddIcon style={{ marginRight: 8 }} />
                  {i18n.t("contactLists.dialog.add")}
                </>
              )}
            </div>
          </Zoom>
        </DialogTitle>
        <Formik
          initialValues={contactList}
          enableReinitialize={true}
          validationSchema={ContactListSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveContactList(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers className={classes.dialogContent}>
                <Fade in={open} timeout={500}>
                  <div className={classes.multFieldLine}>
                    <Field
                      as={TextField}
                      label={i18n.t("contactLists.dialog.name")}
                      autoFocus
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.inputField}
                      InputProps={{
                        startAdornment: (
                          <ListAltIcon className={classes.inputIcon} />
                        ),
                      }}
                    />
                  </div>
                </Fade>
              </DialogContent>
              <DialogActions className={classes.dialogActions}>
                <Fade in={open} timeout={600}>
                  <>
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
                      {i18n.t("contactLists.dialog.cancel")}
                    </Button>
                    <div className={classes.btnWrapper}>
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
                      >
                        {contactListId
                          ? `${i18n.t("contactLists.dialog.okEdit")}`
                          : `${i18n.t("contactLists.dialog.okAdd")}`}
                      </Button>
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  </>
                </Fade>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ContactListModal;