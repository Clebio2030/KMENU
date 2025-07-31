import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import ColorModeContext from "../../layout/themeContext";
import { versionSystem } from "../../../package.json";
import { nomeEmpresa } from "../../../package.json";
import useSettings from "../../hooks/useSettings";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { Checkbox, FormControlLabel, LinearProgress } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import { Helmet } from "react-helmet";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import Dialog from "@material-ui/core/Dialog";
import Grow from "@mui/material/Grow";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import wallfundo from "../../assets/f002.png";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Lock from "@material-ui/icons/Lock";
import { keyframes } from "@emotion/react";

// Ícones
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const handleRedirect = () => {
  window.open("https://wa.me/5519971395449", "_blank");
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

// Animação de flutuação
const floatAnimation = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

// Estilos personalizados
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
    padding: "55px 30px",
    borderRadius: "12.5px",
    maxWidth: "400px",
    width: "100%",
    zIndex: 1,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "$fadeInScale 0.5s ease-out forwards",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    borderRadius: 12,
    margin: 1,
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
    content:
      "url(" +
      (theme.mode === "light"
        ? theme.calculatedLogoLight()
        : theme.calculatedLogoDark()) +
      ")",
    animation: "$springIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both",
  },
  passwordStrengthBar: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  passwordStrengthText: {
    marginTop: theme.spacing(1),
    fontSize: '0.75rem',
    color: "#fff",
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
    padding: "8px 16px",
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
    flexWrap: "wrap",
  },
  socialIcons: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  dialog: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden",
  },
  dialogContent: {
    backgroundColor: "transparent",
    boxShadow: "none",
    padding: 0,
    overflow: "hidden",
  },
  dialogTitle: {
    color: "#fff",
  },
  dialogText: {
    color: "#fff",
  },
  welcomeText: {
    position: "absolute",
    top: "80px",
    right: "20px",
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#fff",
    zIndex: 2,
    backgroundColor: "transparent",
  },
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
  sslBar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "transparent",
    borderRadius: 4,
    color: "#9e9e9e",
    fontSize: "0.75rem",
  },
  lockIcon: {
    fontSize: "1rem",
    marginRight: theme.spacing(0.5),
    color: "#9e9e9e",
  },
  animatedDialog: {
    position: "relative",
    overflow: "hidden",
  },
  floatingElements: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  floatingElement: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    filter: "blur(2px)",
    animation: `${floatAnimation} 10s ease-in-out infinite`,
  },
  formField: {
    animation: "$slideInLeft 0.5s ease-out forwards",
    opacity: 0,
    transform: "translateX(-20px)",
  },
  formButton: {
    animation: "$slideInUp 0.5s ease-out 0.3s forwards",
    opacity: 0,
    transform: "translateY(20px)",
  },
  formCheckbox: {
    animation: "$fadeIn 0.5s ease-out 0.2s forwards",
    opacity: 0,
  },
  formSSL: {
    animation: "$fadeIn 0.5s ease-out 0.4s forwards",
    opacity: 0,
  },
  "@keyframes fadeInScale": {
    "0%": {
      opacity: 0,
      transform: "scale(0.8)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  "@keyframes springIn": {
    "0%": {
      transform: "scale(0)",
    },
    "50%": {
      transform: "scale(1.2)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "@keyframes slideInLeft": {
    "0%": {
      opacity: 0,
      transform: "translateX(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes slideInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
}));

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

const floatingElements = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  size: Math.random() * 30 + 20,
  x: Math.random() * 100,
  y: Math.random() * 100,
  opacity: Math.random() * 0.3 + 0.1,
  delay: Math.random() * 2,
  duration: Math.random() * 10 + 10,
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colorMode } = useContext(ColorModeContext);
  const { appLogoFavicon, appName, mode } = colorMode;
  const [user, setUser] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [allowSignup, setAllowSignup] = useState(false);
  const { getPublicSetting } = useSettings();
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [openLoginPopup, setOpenLoginPopup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleChangeInput = (name, value) => {
    setUser({ ...user, [name]: value });
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleOpenLoginPopup = () => {
    setOpenLoginPopup(true);
  };

  const handleCloseLoginPopup = () => {
    setOpenLoginPopup(false);
  };

  useEffect(() => {
    getPublicSetting("allowSignup")
      .then((data) => {
        setAllowSignup(data === "enabled");
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return "#f44336";
    if (strength <= 4) return "#ff9800";
    return "#4caf50";
  };

  return (
    <>
      <Helmet>
        <title>{appName || "CHATPAGEPRO"}</title>
        <link rel="icon" href={appLogoFavicon || "/default-favicon.ico"} />
      </Helmet>

      {/* Barra superior responsiva */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={isMobile ? classes.mobileToolbar : classes.toolbar}>
          {isMobile ? (
            <>
              <div className={`${classes.leftToolbar} ${classes.mobileLeftToolbar}`}>
                <div className={`${classes.socialIcons} ${classes.mobileSocialIcons}`}>
                  <IconButton
                    style={Stylefacebook}
                    onClick={() => window.open("https://www.facebook.com", "_blank")}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    style={Styleyoutube}
                    onClick={() => window.open("https://www.youtube.com", "_blank")}
                  >
                    <YouTubeIcon />
                  </IconButton>
                  <IconButton
                    style={Styleinstagram}
                    onClick={() => window.open("https://www.instagram.com", "_blank")}
                  >
                    <InstagramIcon />
                  </IconButton>
                </div>
                <Copyright />
              </div>
              <div className={`${classes.rightToolbar} ${classes.mobileRightToolbar}`}>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle2}
                  onClick={handleOpenLoginPopup}
                  startIcon={<LoginIcon />}
                  size="small"
                >
                  {i18n.t("Abrir Login")}
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  style={customStyle}
                  to="/signup"
                  startIcon={<AddIcon />}
                  size="small"
                >
                  {i18n.t("Cadastrar-se")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle3}
                  onClick={handleRedirect}
                  startIcon={<WhatsAppIcon />}
                  size="small"
                >
                  {i18n.t("Dúvidas ?")}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={classes.leftToolbar}>
                <div className={classes.socialIcons}>
                  <IconButton
                    style={Stylefacebook}
                    onClick={() => window.open("https://www.facebook.com", "_blank")}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    style={Styleyoutube}
                    onClick={() => window.open("https://www.youtube.com", "_blank")}
                  >
                    <YouTubeIcon />
                  </IconButton>
                  <IconButton
                    style={Styleinstagram}
                    onClick={() => window.open("https://www.instagram.com", "_blank")}
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
                  onClick={handleOpenLoginPopup}
                  startIcon={<LoginIcon />}
                >
                  {i18n.t("Abrir Login")}
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  style={customStyle}
                  to="/signup"
                  startIcon={<AddIcon />}
                >
                  {i18n.t("Cadastrar-se")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={customStyle3}
                  onClick={handleRedirect}
                  startIcon={<WhatsAppIcon />}
                >
                  {i18n.t("Dúvidas ?")}
                </Button>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        {/* Conteúdo principal */}
      </div>

      {/* Pop-up de Login com animação */}
      <Dialog
        open={openLoginPopup}
        onClose={handleCloseLoginPopup}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: classes.dialog,
        }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <div className={classes.animatedDialog}>
          {/* Elementos flutuantes animados */}
          <div className={classes.floatingElements}>
            {floatingElements.map((element) => (
              <div
                key={element.id}
                className={classes.floatingElement}
                style={{
                  width: element.size,
                  height: element.size,
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  opacity: element.opacity,
                  animationDelay: `${element.delay}s`,
                  animationDuration: `${element.duration}s`,
                }}
              />
            ))}
          </div>

          <DialogContent className={classes.dialogContent}>
            <div className={classes.paper}>
              <div>
                <img className={classes.logoImg} alt="logo" />
              </div>
              <form className={classes.form} noValidate onSubmit={handlSubmit}>
                <div className={classes.formField} style={{ animationDelay: "0.1s" }}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    value={user.email}
                    onChange={(e) =>
                      handleChangeInput(e.target.name, e.target.value.toLowerCase())
                    }
                    autoComplete="off"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                      style: {
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        color: "#000000",
                      },
                      classes: {
                        notchedOutline: {
                          border: "none",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </div>

                <div className={classes.formField} style={{ animationDelay: "0.2s" }}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    name="password"
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={user.password}
                    onChange={(e) =>
                      handleChangeInput(e.target.name, e.target.value)
                    }
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      style: {
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        color: "#000000",
                      },
                      classes: {
                        notchedOutline: {
                          border: "none",
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </div>

                <div className={classes.formField} style={{ animationDelay: "0.3s" }}>
                  <LinearProgress
                    className={classes.passwordStrengthBar}
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    style={{ backgroundColor: getPasswordStrengthColor(passwordStrength) }}
                  />
                  <Typography variant="body2" className={classes.passwordStrengthText}>
                    {passwordStrength <= 2 && "Senha fraca"}
                    {passwordStrength > 2 && passwordStrength <= 4 && "Senha média"}
                    {passwordStrength > 4 && "Senha forte"}
                  </Typography>
                </div>

                <div className={classes.formField} style={{ animationDelay: "0.4s" }}>
                  <Grid container justify="flex-end">
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                      <Link component={RouterLink} to="/forgetpsw" variant="body2">
                        Esqueceu sua senha?
                      </Link>
                    </Grid>
                  </Grid>
                </div>

                <div className={classes.formCheckbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={user.rememberMe}
                        onChange={(e) =>
                          handleChangeInput("rememberMe", e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="Lembre-se de mim"
                  />
                </div>

                <div className={classes.formButton}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={customStyle2}
                    className={classes.submit}
                    startIcon={<LoginIcon />}
                  >
                    {i18n.t("login.buttons.submit")}
                  </Button>
                </div>

                <div className={classes.formSSL}>
                  <div className={classes.sslBar}>
                    <Lock className={classes.lockIcon} />
                    <Typography variant="caption">
                      Conexão segura SSL/TLS
                    </Typography>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default Login;