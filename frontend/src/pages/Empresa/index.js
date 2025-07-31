import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import usePlans from "../../hooks/usePlans";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import {
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Typography,
    Container,
    CssBaseline,
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Fade
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import flags from 'react-phone-number-input/flags';

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
  backgroundColor: "#0f65ab",
  color: "white",
  fontSize: "12px",
};

const customStyle3 = {
  borderRadius: "5px",
  margin: 1,
  boxShadow: "none",
  backgroundColor: "#0ea17b",
  color: "white",
  fontSize: "12px",
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(3),
  },
  paperContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    width: "100%",
    maxWidth: "800px",
  },
  formContainer: {
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: "#ffffff",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& .MuiOutlinedInput-root": {
      height: "40px",
      backgroundColor: "#ffffff",
    },
  },
  phoneInputContainer: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& .PhoneInput": {
      width: "100%",
      "& .PhoneInputInput": {
        height: "40px",
        padding: "10.5px 14px",
        backgroundColor: "#ffffff",
        borderRadius: "4px",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        width: "100%",
        "&:hover": {
          borderColor: "rgba(0, 0, 0, 0.87)",
        },
        "&:focus": {
          borderColor: "#3f51b5",
          borderWidth: "2px",
          outline: "none",
        },
      },
      "& .PhoneInputCountry": {
        marginRight: theme.spacing(1),
      },
      "& .PhoneInputCountrySelect": {
        marginRight: theme.spacing(1),
      },
    },
  },
  inputLabel: {
    marginBottom: theme.spacing(0.5),
    fontWeight: "bold",
    fontSize: "0.875rem",
  },
  submitButton: {
    width: "100%",
    marginTop: theme.spacing(2),
    backgroundColor: "#0f65ab",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#0d47a1",
    },
    height: "40px",
    fontSize: "0.875rem",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
    textAlign: 'center',
  },
  icon: {
    color: "#0f65ab",
  },
  flag: {
    width: "20px",
    height: "15px",
    marginRight: "8px",
  },
  title: {
    marginBottom: theme.spacing(3),
    color: "#0f65ab",
    fontWeight: "bold",
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
  },
  progressText: {
    marginTop: theme.spacing(2),
    color: '#0f65ab',
    fontWeight: 'bold',
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
    phone: Yup.string()
        .required("Telefone é obrigatório"),
});

const SignUp = () => {
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [showPassword, setShowPassword] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const { getPlanList } = usePlans();
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    let companyId = null;

    const params = qs.parse(window.location.search);
    if (params.companyId !== undefined) {
        companyId = params.companyId;
    }

    const initialState = { name: "", email: "", password: "", phone: "", companyId, companyName: "", planId: "" };
    const [user] = useState(initialState);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const planList = await getPlanList();
            const publicPlans = planList.filter(plan => plan.isPublic === true);
            setPlans(publicPlans);
            setLoading(false);
        };
        fetchData();
    }, []);

    const dueDate = moment().add(7, "day").format();
    const handleSignUp = async values => {
        setShowProgress(true);
        Object.assign(values, { recurrence: "MENSAL" });
        Object.assign(values, { dueDate: dueDate });
        Object.assign(values, { status: "t" });
        Object.assign(values, { campaignsEnabled: true });
        try {
            await openApi.post("/auth/signup", values);
            setShowProgress(false);
            setOpenModal(true);
        } catch (err) {
            setShowProgress(false);
            toastError(err);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        history.push("/login");
    };

    return (
        <div className={classes.root}>
            <Grid container className={classes.paperContainer}>
                <Paper className={classes.paper} elevation={3}>
                    <Container component="main" className={classes.formContainer}>
                        <CssBaseline />
                        <Typography component="h1" variant="h4" align="center" className={classes.title}>
                            {i18n.t("CADASTRO DE EMPRESA")}
                        </Typography>
                        <Formik
                            initialValues={user}
                            enableReinitialize={true}
                            validationSchema={UserSchema}
                            onSubmit={(values, actions) => {
                                setTimeout(() => {
                                    handleSignUp(values);
                                    actions.setSubmitting(false);
                                }, 400);
                            }}
                        >
                            {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                                <Form className={classes.form}>
                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        fullWidth
                                        id="companyName"
                                        error={touched.companyName && Boolean(errors.companyName)}
                                        helperText={touched.companyName && errors.companyName}
                                        name="companyName"
                                        placeholder="Nome da Empresa"
                                        autoComplete="companyName"
                                        autoFocus
                                        className={classes.textField}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                backgroundColor: "#ffffff",
                                                borderRadius: "8px",
                                            },
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Seu Nome Completo"
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        variant="outlined"
                                        fullWidth
                                        id="name"
                                        className={classes.textField}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                backgroundColor: "#ffffff",
                                                borderRadius: "8px",
                                            },
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        name="email"
                                        placeholder="Seu Melhor Email"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        autoComplete="email"
                                        className={classes.textField}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                backgroundColor: "#ffffff",
                                                borderRadius: "8px",
                                            },
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        placeholder="Crie uma Senha Segura"
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        autoComplete="current-password"
                                        className={classes.textField}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                backgroundColor: "#ffffff",
                                                borderRadius: "8px",
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

                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        placeholder="Confirme sua Senha"
                                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        autoComplete="confirm-password"
                                        className={classes.textField}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                backgroundColor: "#ffffff",
                                                borderRadius: "8px",
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

                                    <div className={classes.phoneInputContainer}>
                                        <PhoneInput
                                            international
                                            defaultCountry="BR"
                                            value={values.phone}
                                            onChange={(value) => setFieldValue('phone', value)}
                                            flags={flags}
                                            placeholder="Digite seu telefone"
                                            className={classes.phoneInput}
                                        />
                                        {touched.phone && errors.phone && (
                                            <div style={{ color: '#f44336', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <Field
                                        as={Select}
                                        variant="outlined"
                                        fullWidth
                                        id="plan-selection"
                                        name="planId"
                                        required
                                        displayEmpty
                                        className={classes.textField}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                        }}
                                        inputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CardMembershipIcon className={classes.icon} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CardMembershipIcon className={classes.icon} style={{ marginRight: 8 }} />
                                                        <span>Selecione um Plano</span>
                                                    </div>
                                                );
                                            }
                                            const plan = plans.find(p => p.id === selected);
                                            return plan ? plan.name : "Selecione um Plano";
                                        }}
                                    >
                                        <MenuItem value="" disabled>
                                            <CardMembershipIcon className={classes.icon} style={{ marginRight: 8 }} />
                                            Selecione um Plano
                                        </MenuItem>
                                        {plans.map((plan, key) => (
                                            <MenuItem key={key} value={plan.id}>
                                                {plan.name} - Atendentes: {plan.users} - Conexões: {plan.connections} - Filas:{" "}
                                                {plan.queues} - $ {plan.amount}
                                            </MenuItem>
                                        ))}
                                    </Field>

                                    <Box mt={3}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            className={classes.submitButton}
                                            disabled={isSubmitting}
                                            style={customStyle2}
                                        >
                                            {i18n.t("signup.buttons.submit")}
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Container>
                </Paper>
            </Grid>

            {/* Progress Modal */}
            <Dialog
                open={showProgress}
                aria-labelledby="progress-dialog-title"
                aria-describedby="progress-dialog-description"
                className={classes.modal}
                disableBackdropClick
                disableEscapeKeyDown
            >
                <div className={classes.progressContainer}>
                    <CircularProgress size={60} thickness={5} style={{ color: '#0f65ab' }} />
                    <Typography variant="h6" className={classes.progressText}>
                        Realizando Cadastro...
                    </Typography>
                    <Typography variant="body1" style={{ color: '#0f65ab', marginTop: '10px' }}>
                        Por favor, aguarde enquanto processamos seu cadastro.
                    </Typography>
                </div>
            </Dialog>

            {/* Success Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className={classes.modal}
            >
                <DialogTitle id="modal-title" style={{ backgroundColor: "#0f65ab", color: "#ffffff" }}>
                    Cadastro Realizado com Sucesso!
                </DialogTitle>
                <DialogContent style={{ backgroundColor: "#ffffff" }}>
                    <Typography variant="h6" id="modal-description" style={{ color: "#0f65ab" }}>
                        Parabéns! Seu cadastro foi realizado com sucesso.
                    </Typography>
                    <Typography variant="body1" style={{ color: "#0f65ab" }}>
                        Agora a Empresa podera acessar sua conta e começar a usar nossa plataforma.
                    </Typography>
                </DialogContent>
                <DialogActions style={{ backgroundColor: "#ffffff" }}>
                    <Button onClick={handleCloseModal} style={{ color: "#0f65ab" }}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SignUp;