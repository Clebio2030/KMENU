import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import usePlans from "../../hooks/usePlans";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import {
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Container,
    CssBaseline,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    AppBar,
    Toolbar,
    CircularProgress,
    Fade,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Card,
    CardContent,
    CardActions,
    Grow,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SaveIcon from '@mui/icons-material/Save';
import LoginIcon from '@mui/icons-material/Login';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Lock from "@material-ui/icons/Lock";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import logo from "../../assets/logo.png";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Link from "@material-ui/core/Link";
import { versionSystem } from "../../../package.json";
import { nomeEmpresa } from "../../../package.json";
import wallfundo from "../../assets/f002.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import { keyframes } from "@emotion/react";

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

// Animação de flutuação
const floatAnimation = keyframes`
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
`;

const Copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center" style={{ color: "white" }}>
        © {new Date().getFullYear()}
        {" - "}
        <Link color="inherit" href="#" style={{ color: "white" }}>
          { nomeEmpresa } - v { versionSystem }
        </Link>
        {"."}
      </Typography>
    );
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
    animation: "$springIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both",
  },
  textField: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    animation: "$slideInLeft 0.5s ease-out forwards",
    opacity: 0,
    transform: "translateX(-20px)",
  },
  phoneInputContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "8.5px 14px",
    width: "100%",
    "&:focus-within": {
      borderColor: "#3f51b5",
    },
    animation: "$slideInLeft 0.5s ease-out forwards",
    opacity: 0,
    transform: "translateX(-20px)",
  },
  phoneInput: {
    backgroundColor: "#ffffff",
    border: "none",
    outline: "none",
    width: "100%",
    color: "#000000",
  },
  appBar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    boxShadow: "none",
    position: "absolute",
    top: 0,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    textAlign: "center",
  },
  progressText: {
    marginTop: theme.spacing(2),
    color: "#444198",
    fontWeight: "bold",
  },
  mobileToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "8px 16px",
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
    animation: "$fadeIn 0.5s ease-out 0.4s forwards",
    opacity: 0,
  },
  lockIcon: {
    fontSize: "1rem",
    marginRight: theme.spacing(0.5),
    color: "#9e9e9e",
  },
  menuButton: {
    color: "white",
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
    backgroundColor: "rgba(68, 65, 152, 0.9)",
    backdropFilter: "blur(10px)",
    color: "white",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerItem: {
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  drawerIcon: {
    color: "white",
  },
  copyrightContainer: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  planButton: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    animation: "$slideInLeft 0.5s ease-out 0.3s forwards",
    opacity: 0,
    transform: "translateX(-20px)",
  },
  planButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  planName: {
    fontWeight: 'bold',
    color: '#444198',
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
  },
  planDetails: {
    color: '#666',
    fontSize: '0.85rem',
    marginBottom: theme.spacing(0.5),
  },
  planPrice: {
    color: '#444198',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  selectPlanText: {
    color: '#666',
    fontSize: '1rem',
    textAlign: 'center',
    width: '100%',
  },
  planDialog: {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  planCard: {
    borderRadius: '12px',
    margin: theme.spacing(2),
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  popularBadge: {
    position: 'absolute',
    top: theme.spacing(-1),
    right: theme.spacing(2),
    backgroundColor: '#ff9800',
    color: 'white',
    padding: theme.spacing(0.5, 2),
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    paddingLeft: 0,
    listStyleType: 'none',
    marginTop: theme.spacing(2),
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontSize: '0.9rem',
  },
  featureIcon: {
    marginRight: theme.spacing(1),
    color: '#4caf50',
    fontSize: '1rem',
  },
  dialogPlanPrice: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#444198',
    margin: theme.spacing(1, 0),
    textAlign: 'center',
  },
  planPeriod: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
  },
  cardContent: {
    paddingTop: theme.spacing(3),
    position: 'relative',
  },
  cardActions: {
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
  },
  termsCheckbox: {
    animation: "$fadeIn 0.5s ease-out 0.2s forwards",
    opacity: 0,
  },
  submitButton: {
    animation: "$slideInUp 0.5s ease-out 0.3s forwards",
    opacity: 0,
    transform: "translateY(20px)",
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

const UserSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Muito curto!")
        .max(50, "Muito extenso!")
        .required("Obrigatório"),
    password: Yup.string()
        .min(5, "Muito curto!")
        .max(50, "Muito extenso!")
        .required("Obrigatório"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "As senhas não são iguais.")
        .required("Por favor, confirme sua senha."),
    email: Yup.string()
        .email("Email inválido")
        .required("Obrigatório"),
    planId: Yup.string()
        .required("Por favor, selecione um plano.")
});

const SignupFormRenderer = (props) => {
    const { 
        selectedPlan, 
        values, 
        errors, 
        touched, 
        isSubmitting, 
        setFieldValue, 
        classes, 
        showPassword, 
        toggleShowPassword, 
        handleOpen: handleOpenTermsParent,
        agreeToTerms, 
        setAgreeToTerms, 
        termsModalOpen: termsModalOpenParent,
        handleClose: handleCloseTermsParent,
        openPlanModal 
    } = props;

    React.useEffect(() => {
        if (selectedPlan && (!values.planId || values.planId !== selectedPlan.id)) {
            setFieldValue('planId', selectedPlan.id);
        } else if (!selectedPlan && values.planId) {
            setFieldValue('planId', '');
        }
    }, [selectedPlan]);

    const isSubmitDisabled = !agreeToTerms || isSubmitting || !selectedPlan || !values.planId;

    return (
        <Form className={classes.form}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        id="companyName"
                        error={touched.companyName && Boolean(errors.companyName)}
                        helperText={touched.companyName && errors.companyName}
                        name="companyName"
                        placeholder="Nome da Empresa"
                        autoFocus
                        className={classes.textField}
                        style={{ animationDelay: "0.1s" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessIcon color="action" />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                color: "#605757",
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        as={TextField}
                        autoComplete="name"
                        name="name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        id="name"
                        placeholder="Nome Completo"
                        className={classes.textField}
                        style={{ animationDelay: "0.15s" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                color: "#605757",
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        id="email"
                        name="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        placeholder="Email"
                        className={classes.textField}
                        style={{ animationDelay: "0.2s" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                color: "#605757",
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        as={TextField}
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        name="password"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Senha"
                        className={classes.textField}
                        style={{ animationDelay: "0.25s" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                color: "#605757",
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
                        margin="dense"
                        required
                        fullWidth
                        name="confirmPassword"
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirme a Senha"
                        className={classes.textField}
                        style={{ animationDelay: "0.3s" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                color: "#605757",
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.phoneInputContainer} style={{ animationDelay: "0.35s" }}>
                        <Field name="phone">
                            {({ field }) => (
                                <PhoneInput
                                    {...field}
                                    international
                                    defaultCountry="BR"
                                    onChange={(value) => setFieldValue('phone', value)}
                                    className={classes.phoneInput}
                                    placeholder="Telefone"
                                    inputStyle={{
                                        backgroundColor: "#ffffff",
                                        border: "none",
                                        outline: "none",
                                        width: "100%",
                                        color: "#605757",
                                    }}
                                    icon={<PhoneIcon color="action" style={{ marginRight: "8px" }} />}
                                />
                            )}
                        </Field>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CardMembershipIcon />}
                        onClick={openPlanModal}
                        className={classes.planButton}
                        style={{
                            backgroundColor: selectedPlan ? '#e3f2fd' : '#ffffff',
                            border: selectedPlan ? '2px solid #444198' : touched.planId && errors.planId ? '2px solid red' : '1px solid #ddd',
                            animationDelay: "0.4s",
                        }}
                    >
                        <div className={classes.planButtonContent}>
                            {selectedPlan ? (
                                <>
                                    <Typography className={classes.planName}>
                                        {selectedPlan.name}
                                    </Typography>
                                    <Typography className={classes.planDetails}>
                                        Atendentes: {selectedPlan.users} | Conexões: {selectedPlan.connections} | Filas: {selectedPlan.queues}
                                    </Typography>
                                    <Typography className={classes.planPrice}>
                                        R$ {selectedPlan.amount}/mês
                                    </Typography>
                                </>
                            ) : (
                                <Typography className={classes.selectPlanText}>
                                    Selecione um plano...
                                </Typography>
                            )}
                        </div>
                    </Button>
                    {touched.planId && errors.planId && (
                        <Typography color="error" variant="caption" style={{ marginLeft: '14px', display: 'block' }}>
                            {errors.planId}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        className={classes.termsCheckbox}
                        control={
                            <Checkbox
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                name="agreeToTerms"
                                color="primary"
                            />
                        }
                        label={
                            <span>
                                Eu concordo com os {" "}
                                <span
                                    onClick={handleOpenTermsParent}
                                    style={{ color: "blue", textDecoration: "none", cursor: "pointer" }}
                                >
                                    Termos e Condições
                                </span>
                            </span>
                        }
                    />
                    <Dialog 
                        open={termsModalOpenParent} 
                        onClose={handleCloseTermsParent} 
                        maxWidth="md" 
                        fullWidth
                        TransitionComponent={Grow}
                        BackdropProps={{
                            style: { backgroundColor: "rgba(0,0,0,0.7)" },
                        }}
                    >
                        <DialogTitle>TERMOS DE USO DO SISTEMA KMENU</DialogTitle>
                        <DialogContent dividers>
                            <p><strong>1. ACEITAÇÃO DOS TERMOS</strong></p>
                            <p>1.1. Estes Termos de Uso ("Termos") regem o uso do sistema web KMENU, disponibilizado pela Empresa Core Sistemas de propriedade do programador EURICO JÚNIOR. 1.2. Ao acessar ou utilizar o Sistema, o usuário concorda em cumprir estes Termos. Caso não concorde, deve cessar o uso do Sistema imediatamente.</p>
                            <p><strong>2. LICENÇA DE USO</strong></p>
                            <p>2.1. O Licenciante concede ao Usuário uma licença limitada, não exclusiva, intransferível e revogável para uso do Sistema de acordo com estes Termos. 2.2. O Usuário não poderá modificar, distribuir, vender, alugar, sublicenciar ou realizar engenharia reversa sobre o Sistema, salvo quando expressamente permitido por lei.</p>
                            <p><strong>3. DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL</strong></p>
                            <p>3.1. O Sistema, incluindo código-fonte, design, logotipos e demais conteúdos, é protegido por leis de direitos autorais e outras leis de propriedade intelectual. 3.2. Nenhuma parte do Sistema poderá ser copiada, reproduzida ou utilizada sem a autorização expressa do Licenciante. 3.3. O Licenciante detém todos os direitos, títulos e interesses relacionados ao Sistema.</p>
                            <p><strong>4. ACESSO E DISPONIBILIDADE</strong></p>
                            <p>4.1. O Licenciante se esforçará para manter o Sistema disponível de forma contínua, mas não garante que o acesso será ininterrupto ou livre de erros. 4.2. O Usuário reconhece que o acesso ao Sistema pode ser temporariamente interrompido para manutenção, atualizações ou fatores externos.</p>
                            <p><strong>5. ATUALIZAÇÕES E MODIFICAÇÕES</strong></p>
                            <p>5.1. O Licenciante poderá, a seu critério, fornecer atualizações e melhorias no Sistema, sendo que algumas funcionalidades podem ser alteradas ou descontinuadas sem aviso prévio. 5.2. O Usuário deve manter-se informado sobre as atualizações para garantir sua funcionalidade adequada.</p>
                            <p><strong>6. RESPONSABILIDADES DO USUÁRIO</strong></p>
                            <p>6.1. O Usuário se compromete a utilizar o Sistema de forma lícita e em conformidade com estes Termos. 6.2. O Licenciante não se responsabiliza por qualquer dano decorrente do uso indevido do Sistema pelo Usuário. 6.3. O Usuário é responsável por manter a segurança de suas credenciais de acesso e por todas as atividades realizadas em sua conta.</p>
                            <p><strong>7. LIMITAÇÃO DE RESPONSABILIDATE</strong></p>
                            <p>7.1. O Sistema é fornecido, com garantias de uso e funcionalidades, expressas ou implícitas. 7.2. O Licenciante não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou impossibilidade de uso do Sistema.</p>
                            <p><strong>8. CONTATO</strong></p>
                            <p>Para dúvidas ou esclarecimentos, o Usuário pode entrar em contato com o Licenciante pelo e-mail <strong>euricotecnologia@gmail.com</strong> ou pelo Whatsapp <strong><a href="https://wa.me/5519971395449" target="_blank" rel="noopener noreferrer">+55 19971395449</a></strong>.</p>
                            <p><em>Última atualização: 07-02-2025</em></p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseTermsParent} color="primary">Fechar</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<SaveIcon />}
                            color="primary"
                            style={customStyle2}
                            className={`${classes.submit} ${classes.submitButton}`}
                            disabled={isSubmitDisabled}
                        >
                            {i18n.t("signup.buttons.submit")}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.sslBar}>
                            <Lock className={classes.lockIcon} />
                            <Typography variant="caption">
                                Conexão segura SSL/TLS
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Form>
    );
};

const SignUp = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    const history = useHistory();
    
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [processingModalOpen, setProcessingModalOpen] = useState(false);
    const [processingText, setProcessingText] = useState("Realizando cadastro...");
    const { getPlanList } = usePlans();
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    
    let companyId = null;
    const params = qs.parse(window.location.search);
    if (params.companyId !== undefined) {
        companyId = params.companyId;
    }

    const initialState = { name: "", email: "", password: "", confirmPassword: "", phone: "", companyId, companyName: "", planId: "" };

    const [plans, setPlans] = useState([]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const planList = await getPlanList();
                
                if (isMounted) {
                    const publicPlans = planList.filter(plan => plan.isPublic === true);
                    setPlans(publicPlans);
                }
            } catch (error) {
                if (isMounted) {
                    toastError("Erro ao carregar planos. Tente novamente.");
                    console.error("Plan fetch error:", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, []);

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleOpenTermsModal = () => {
        setTermsModalOpen(true);
    };

    const handleCloseTermsModal = () => {
        setTermsModalOpen(false);
    };
    
    const dueDate = moment().add(7, "day").format();
    const handleSignUp = async (values) => {
        setProcessingModalOpen(true);
        setProcessingText("Validando dados...");
        
        const stages = [
            "Criando conta...",
            "Configurando ambiente...",
            "Finalizando cadastro..."
        ];
        
        for (let i = 0; i < stages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 700));
            setProcessingText(stages[i]);
        }
        
        const dataToSend = {
            ...values,
            phone: values.phone ? values.phone.replace(/\D/g, '') : '',
            recurrence: "MENSAL",
            dueDate: dueDate,
            status: "t",
            campaignsEnabled: true,
        };
        
        try {
            await openApi.post("/auth/signup", dataToSend);
            await new Promise(resolve => setTimeout(resolve, 500));
            setProcessingModalOpen(false);
            setSuccessModalOpen(true);
        } catch (err) {
            setProcessingModalOpen(false);
            toastError(err);
        }
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalOpen(false);
        history.push("/login");
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const openPlanModal = () => {
        setPlanModalOpen(true);
    };

    const closePlanModal = () => {
        setPlanModalOpen(false);
    };

    const selectPlan = (plan) => {
        setSelectedPlan(plan);
        setPlanModalOpen(false);
    };

    const drawerContent = () => (
        <div
            className={classes.drawer}
            role="presentation"
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon className={classes.drawerIcon} />
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem 
                    button 
                    className={classes.drawerItem}
                    component={RouterLink} 
                    to="/login"
                    onClick={toggleDrawer(false)}
                >
                    <ListItemIcon className={classes.drawerIcon}>
                        <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Fazer Login" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem 
                    button 
                    className={classes.drawerItem}
                    onClick={() => { window.open("https://www.facebook.com/profile.php?id=100080406980835", "_blank"); toggleDrawer(false)(); }}
                >
                    <ListItemIcon className={classes.drawerIcon}>
                        <FacebookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Facebook" />
                </ListItem>
                <ListItem 
                    button 
                    className={classes.drawerItem}
                    onClick={() => { window.open("https://www.youtube.com/@coresistemas2308/videos", "_blank"); toggleDrawer(false)(); }}
                >
                    <ListItemIcon className={classes.drawerIcon}>
                        <YouTubeIcon />
                    </ListItemIcon>
                    <ListItemText primary="YouTube" />
                </ListItem>
                <ListItem 
                    button 
                    className={classes.drawerItem}
                    onClick={() => { window.open("https://www.instagram.com/seuinstagram", "_blank"); toggleDrawer(false)(); }}
                >
                    <ListItemIcon className={classes.drawerIcon}>
                        <InstagramIcon />
                    </ListItemIcon>
                    <ListItemText primary="Instagram" />
                </ListItem>
            </List>
            <Divider />
            <div className={classes.copyrightContainer}>
                <Copyright />
            </div>
        </div>
    );

    // Elementos flutuantes animados
    const floatingElements = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        size: Math.random() * 30 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 10,
    }));

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar className={isMobile ? classes.mobileToolbar : classes.toolbar}>
                    {isMobile ? (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
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
                                    startIcon={<LoginIcon />}
                                    component={RouterLink}
                                    style={customStyle}
                                    to="/login"
                                >
                                    {i18n.t("signup.buttons.login")}
                                </Button>
                            </div>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {drawerContent()}
            </Drawer>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
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

                    <img src={logo} alt="Logo da Empresa" className={classes.logoImg} />
                    <Typography component="h1" variant="h5">
                        {i18n.t("signup.title")}! 
                    </Typography>
                    <Formik
                        initialValues={initialState}
                        enableReinitialize={false} 
                        validationSchema={UserSchema}
                        onSubmit={(values, actions) => {
                            if (!values.planId) {
                                setProcessingModalOpen(false);
                                toastError("Por favor, selecione um plano para prosseguir.");
                                actions.setSubmitting(false); 
                                return;
                            }
                            handleSignUp(values).finally(() => {
                            });
                        }}
                    >
                        {(formikProps) => (
                            <SignupFormRenderer
                                selectedPlan={selectedPlan}
                                classes={classes}
                                showPassword={showPassword}
                                toggleShowPassword={toggleShowPassword}
                                handleOpen={handleOpenTermsModal}
                                agreeToTerms={agreeToTerms}
                                setAgreeToTerms={setAgreeToTerms}
                                termsModalOpen={termsModalOpen}
                                handleClose={handleCloseTermsModal}
                                openPlanModal={openPlanModal}
                                {...formikProps}
                            />
                        )}
                    </Formik>
                </div>
            </Container>

            <Dialog
                open={planModalOpen}
                onClose={closePlanModal}
                maxWidth="md"
                fullWidth
                TransitionComponent={Grow}
                BackdropProps={{
                    style: { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
                classes={{
                    paper: classes.planDialog,
                }}
            >
                <DialogTitle style={{ textAlign: 'center', color: '#444198', fontWeight: 'bold', paddingBottom: '8px' }}>
                    Escolha o Plano Ideal para Você
                    <Typography variant="body2" style={{ color: '#666', marginTop: '8px' }}>
                        Todos os planos incluem suporte e atualizações gratuitas
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {loading && (
                        <Box display="flex" justifyContent="center" my={3}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loading && plans.length === 0 && (
                         <Typography color="textSecondary" align="center" style={{padding: "20px"}}>
                             Nenhum plano disponível no momento.
                         </Typography>
                    )}
                    {!loading && plans.length > 0 && (
                        <Grid container spacing={2} justifyContent="center">
                            {plans.map((plan, index) => (
                                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                                    <Card 
                                        className={classes.planCard} 
                                        style={{ 
                                            border: selectedPlan?.id === plan.id ? '2px solid #444198' : '1px solid #e0e0e0',
                                            backgroundColor: selectedPlan?.id === plan.id ? '#f0f7ff' : '#ffffff',
                                        }}
                                    >
                                        {index === 1 && (
                                            <div className={classes.popularBadge}>
                                                <StarIcon style={{ fontSize: '1rem', marginRight: '4px' }} />
                                                POPULAR
                                            </div>
                                        )}
                                        <CardContent className={classes.cardContent} style={{paddingTop: index === 1 ? theme.spacing(5) : theme.spacing(3)}}>
                                            <Typography variant="h5" component="h2" style={{ 
                                                color: '#444198', 
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}>
                                                {plan.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', minHeight: '3em' }}>
                                                Ideal para {plan.users === 1 ? 'pequenas empresas' : plan.users <= 3 ? 'empresas em crescimento' : 'grandes empresas'}
                                            </Typography>
                                            <Typography className={classes.dialogPlanPrice}>
                                                R$ {plan.amount}
                                                <span className={classes.planPeriod}>/mês</span>
                                            </Typography>
                                            <ul className={classes.featureList}>
                                                <li className={classes.featureItem}>
                                                    <CheckCircleIcon className={classes.featureIcon} />
                                                    {plan.users} Atendente(s)
                                                </li>
                                                <li className={classes.featureItem}>
                                                    <CheckCircleIcon className={classes.featureIcon} />
                                                    {plan.connections} Conexão(ões) WhatsApp
                                                </li>
                                                <li className={classes.featureItem}>
                                                    <CheckCircleIcon className={classes.featureIcon} />
                                                    {plan.queues} Fila(s) de atendimento
                                                </li>
                                                <li className={classes.featureItem}>
                                                    <CheckCircleIcon className={classes.featureIcon} />
                                                    Suporte prioritário
                                                </li>
                                                <li className={classes.featureItem}>
                                                    <CheckCircleIcon className={classes.featureIcon} />
                                                    Atualizações gratuitas
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardActions className={classes.cardActions}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => selectPlan(plan)}
                                                style={{
                                                    backgroundColor: selectedPlan?.id === plan.id ? '#444198' : '#757de8',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    margin: '0 16px',
                                                    padding: '10px 0',
                                                }}
                                            >
                                                {selectedPlan?.id === plan.id ? 'Selecionado' : 'Selecionar Plano'}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
                    <Button 
                        onClick={closePlanModal} 
                        style={{ 
                            color: '#444198',
                            fontWeight: 'bold',
                        }}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={processingModalOpen} 
                disableBackdropClick 
                disableEscapeKeyDown
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    }
                }}
                TransitionComponent={Grow}
            >
                <DialogContent className={classes.progressContainer}>
                    <Fade
                        in={processingModalOpen}
                        style={{
                            transitionDelay: processingModalOpen ? '300ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress 
                            size={60} 
                            thickness={4}
                            style={{ color: '#444198' }}
                        />
                    </Fade>
                    <Typography variant="h6" className={classes.progressText}>
                        {processingText}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: '10px', color: '#666' }}>
                        Por favor, aguarde enquanto processamos seu cadastro...
                    </Typography>
                </DialogContent>
            </Dialog>

            <Dialog 
                open={successModalOpen} 
                onClose={handleCloseSuccessModal}
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center',
                    }
                }}
                TransitionComponent={Grow}
            >
                <DialogTitle style={{ color: "#4caf50", fontWeight: "bold", paddingBottom: "0" }}>
                    <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                        <CheckCircleIcon style={{ fontSize: 64, color: "#4caf50" }}/>
                    </Box>
                    Cadastro Realizado com Sucesso!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: "#555", fontSize: "16px" }}>
                        Seu cadastro foi realizado com sucesso. Agora você pode fazer login e começar a usar o sistema.
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
                    <Button 
                        onClick={handleCloseSuccessModal} 
                        variant="contained" 
                        style={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '8px 24px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '16px',
                            boxShadow: 'none',
                        }}
                        autoFocus
                    >
                        Fazer Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SignUp;