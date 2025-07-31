import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import { toast } from 'react-toastify'; 
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import wallfundo from "../../assets/f002.png";
import logo from "../../assets/logo.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import Lock from "@material-ui/icons/Lock"; // Ícone de cadeado para a barra SSL
import { versionSystem } from "../../../package.json";
import { nomeEmpresa } from "../../../package.json";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444198",
    overflow: "hidden",
    position: "relative",
    backgroundImage: `url(${wallfundo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    borderRadius: "12.5px",
    maxWidth: "400px",
    width: "100%",
    zIndex: 1,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    borderRadius: 12,
    margin: theme.spacing(2, 1, 1),
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(117, 191, 230, 0.8)",
    color: "white",
    fontSize: "12px",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
    },
  },
  logoImg: {
    width: "100%",
    maxWidth: "350px",
    height: "auto",
    maxHeight: "120px",
    margin: "0 auto",
  },
  appBar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    boxShadow: "none",
    backdropFilter: "blur(10px)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  leftToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  rightToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  socialIcons: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      "& input": {
        padding: "10px 14px",
        fontSize: "14px",
      },
    },
    "& .MuiInputLabel-outlined": {
      transform: "translate(14px, 14px) scale(1)",
      fontSize: "14px",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(14px, -6px) scale(0.75)",
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
  },
  // Estilos para mobile
  mobileToolbar: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "8px",
  },
  mobileLeftToolbar: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  mobileRightToolbar: {
    width: "100%",
    justifyContent: "flex-end",
  },
  mobileSocialIcons: {
    justifyContent: "center",
    width: "100%",
    marginBottom: "8px",
  },
  // Estilo para a barra SSL
  sslBar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "transparent",
    borderRadius: 4,
    color: "#9e9e9e", // Cor cinza
    fontSize: "0.75rem",
  },
  lockIcon: {
    fontSize: "1rem",
    marginRight: theme.spacing(0.5),
    color: "#9e9e9e", // Cor cinza para o ícone
  },
}));

const Stylefacebook = {
  borderRadius: "50%",
  backgroundColor: "#5664af",
  color: "white",
  padding: "10px",
};

const Styleyoutube = {
  borderRadius: "50%",
  backgroundColor: "#ce6060",
  color: "white",
  padding: "10px",
};

const Styleinstagram = {
  borderRadius: "50%",
  backgroundColor: "#e1306c",
  color: "white",
  padding: "10px",
};

const customStyle = {
  borderRadius: "5px",
  margin: 1,
  boxShadow: "none",
  backgroundColor: "#F78C6B",
  color: "white",
  fontSize: "12px",
};

const customStyle2 = {
  borderRadius: "5px",
  margin: 1,
  boxShadow: "none",
  backgroundColor: "#444198",
  color: "white",
  fontSize: "12px",
};

const customStyle3 = {
  borderRadius: "5px",
  margin: 1,
  boxShadow: "none",
  backgroundColor: "#4ec24e",
  color: "white",
  fontSize: "12px",
};

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center" style={{ color: "white", marginLeft: "20px" }}>
      © {new Date().getFullYear()}
      {" - "}
      <Link color="inherit" href="#" style={{ color: "white" }}>
        {nomeEmpresa} - v {versionSystem}
      </Link>
      {"."}
    </Typography>
  );
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

  const handleSendEmail = async (values) => {
    const email = values.email;
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
      );
      console.log("API Response:", response.data);

      if (response.data.status === 404) {
        toast.error("Email não encontrado");
      } else {
        toast.success(i18n.t("Email enviado com sucesso!"));
      }
    } catch (err) {
      console.log("API Error:", err);
      toastError(err);
    }
  };

  const handleResetPassword = async (values) => {
    const email = values.email;
    const token = values.token;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword === confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
        );
        setError("");
        toast.success(i18n.t("Senha redefinida com sucesso."));
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Obrigatório"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required("Campo obrigatório")
          .matches(
            passwordRegex,
            "Sua senha precisa ter no mínimo 8 caracteres, sendo uma letra maiúscula, uma minúscula e um número."
          )
      : Yup.string(),
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Redefinir Senha</title>
        <img src={logo} alt="Logo da Empresa" className={classes.logoImg} />
      </Helmet>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={isMobile ? classes.mobileToolbar : classes.toolbar}>
          {isMobile ? (
            <>
              <div className={`${classes.leftToolbar} ${classes.mobileLeftToolbar}`}>
                <div className={`${classes.socialIcons} ${classes.mobileSocialIcons}`}>
                  <IconButton
                    style={Stylefacebook}
                    onClick={() => window.open("https://www.facebook.com/profile.php?id=100080406980835", "_blank")}
                    size="small"
                  >
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    style={Styleyoutube}
                    onClick={() => window.open("https://www.youtube.com/@coresistemas2308/videos", "_blank")}
                    size="small"
                  >
                    <YouTubeIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    style={Styleinstagram}
                    onClick={() => window.open("https://www.instagram.com/seuinstagram", "_blank")}
                    size="small"
                  >
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                </div>
                <Copyright />
              </div>
              <div className={classes.mobileRightToolbar}>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle2}
                  component={RouterLink}
                  to="/"
                  startIcon={<HomeIcon />}
                  size="small"
                >
                  Página Inicial
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle}
                  component={RouterLink}
                  to="/signup"
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Cadastra-se
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={classes.leftToolbar}>
                <div className={classes.socialIcons}>
                  <IconButton
                    style={Stylefacebook}
                    onClick={() => window.open("https://www.facebook.com/profile.php?id=100080406980835", "_blank")}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    style={Styleyoutube}
                    onClick={() => window.open("https://www.youtube.com/@coresistemas2308/videos", "_blank")}
                  >
                    <YouTubeIcon />
                  </IconButton>
                  <IconButton
                    style={Styleinstagram}
                    onClick={() => window.open("https://www.instagram.com/seuinstagram", "_blank")}
                  >
                    <InstagramIcon />
                  </IconButton>
                </div>
                <Copyright />
              </div>
              <div className={classes.rightToolbar}>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle2}
                  component={RouterLink}
                  to="/"
                  startIcon={<HomeIcon />}
                >
                  Página Inicial
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle}
                  component={RouterLink}
                  to="/signup"
                  startIcon={<AddIcon />}
                >
                  Cadastra-se
                </Button>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div>
            <img
              className={classes.logoImg}
              src={logo}
              alt="Logo"
            />
          </div>
          <Typography component="h1" variant="h5">
            {i18n.t("Redefinir senha")}
          </Typography>
          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                if (showResetPasswordButton) {
                  handleResetPassword(values);
                } else {
                  handleSendEmail(values);
                }
                actions.setSubmitting(false);
                toggleAdditionalFields();
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="email"
                      name="email"
                      placeholder="Digite seu e-mail"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                      required
                      className={classes.textField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {showAdditionalFields && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          id="token"
                          name="token"
                          placeholder="Código de verificação"
                          error={touched.token && Boolean(errors.token)}
                          helperText={touched.token && errors.token}
                          autoComplete="off"
                          required
                          className={classes.textField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          placeholder="Nova senha"
                          error={
                            touched.newPassword &&
                            Boolean(errors.newPassword)
                          }
                          helperText={
                            touched.newPassword && errors.newPassword
                          }
                          autoComplete="off"
                          required
                          className={classes.textField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirme a senha"
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword &&
                            errors.confirmPassword
                          }
                          autoComplete="off"
                          required
                          className={classes.textField}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                
                <div className={classes.buttonContainer}>
                  {showResetPasswordButton ? (
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={customStyle2}
                      className={classes.submit}
                      startIcon={<VpnKeyIcon />}
                    >
                      Redefinir Senha
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={customStyle2}
                      className={classes.submit}
                      startIcon={<EmailIcon />}
                    >
                      Enviar Email
                    </Button>
                  )}
                </div>
                
                {/* Barra de Conexão Segura SSL/TLS */}
                <div className={classes.sslBar}>
                  <Lock className={classes.lockIcon} />
                  <Typography variant="caption">
                    Conexão segura SSL/TLS
                  </Typography>
                </div>
                
                <Grid container justifyContent="flex-end">
                  <Grid item>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5} />
      </Container>
    </div>
  );
};

export default ForgetPassword;