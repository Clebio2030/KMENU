import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	TextField,
	InputAdornment,
	IconButton,
	FormControlLabel,
	Switch,
} from '@material-ui/core';
import { 
	Visibility, 
	VisibilityOff,
	Business,
	Email,
	Security,
	People,
	Link,
	ToggleOn,
	ToggleOff
} from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import { green, blue } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

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
	dialogTitle: {
		backgroundColor: "#3f51b5",
		color: "white",
		cursor: "move",
	},
}));

const CompanySchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Muito curto!")
		.max(50, "Muito longo!")
		.required("Nome é obrigatório"),
	email: Yup.string().email("Email inválido").required("E-mail é obrigatório"),
	numberAttendants: Yup.number(),
	numberConections: Yup.number(),
});

const CompanyModal = ({ open, onClose, companyId }) => {
	const classes = useStyles();
	const [company, setCompany] = useState({
		name: "",
		email: "",
		passwordDefault: "",
		numberAttendants: 1,
		numberConections: 1,
		status: false
	});
	const [showPassword, setShowPassword] = useState(false);
	const dialogRef = useRef(null);
	const [dragging, setDragging] = useState(false);
	const [relX, setRelX] = useState(0);
	const [relY, setRelY] = useState(0);

	useEffect(() => {
		const fetchCompany = async () => {
			if (!companyId) return;
			try {
				const { data } = await api.get(`/companies/listPlan/${companyId}`);
				setCompany(prevState => ({ ...prevState, ...data }));
			} catch (err) {
				toastError(err);
			}
		};

		fetchCompany();
	}, [companyId, open]);

	const handleClose = () => {
		onClose();
		setCompany({
			name: "",
			email: "",
			passwordDefault: "",
			numberAttendants: 1,
			numberConections: 1,
			status: false
		});
	};

	const handleSaveCompany = async values => {
		try {
			if (companyId) {
				await api.put(`/companies/${companyId}`, values);
			} else {
				await api.post("/companies", values);
			}
			toast.success(i18n.t("companyModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	const handleMouseDown = (e) => {
		const dragElement = dialogRef.current;
		if (dragElement) {
			setDragging(true);
			const rect = dragElement.getBoundingClientRect();
			setRelX(e.clientX - rect.left);
			setRelY(e.clientY - rect.top);
		}
	};

	const handleMouseUp = () => {
		setDragging(false);
	};

	const handleMouseMove = (e) => {
		if (dragging) {
			const dragElement = dialogRef.current;
			if (dragElement) {
				dragElement.style.left = `${e.clientX - relX}px`;
				dragElement.style.top = `${e.clientY - relY}px`;
			}
		}
	};

	useEffect(() => {
		if (dragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		} else {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		}
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [dragging]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="xs"
			fullWidth
			scroll="paper"
			ref={dialogRef}
			style={{ position: "absolute" }}
			onMouseDown={handleMouseDown}
		>
			<DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
				{companyId
					? `${i18n.t("companyModal.title.edit")}`
					: `${i18n.t("companyModal.title.add")}`}
			</DialogTitle>
			<Formik
				initialValues={company}
				enableReinitialize
				validationSchema={CompanySchema}
				onSubmit={(values, actions) => {
					setTimeout(() => {
						handleSaveCompany(values);
						actions.setSubmitting(false);
					}, 400);
				}}
			>
				{({ values, touched, errors, isSubmitting }) => (
					<Form>
						<DialogContent dividers>
							<div className={classes.multFieldLine}>
								<Field
									as={TextField}
									label={i18n.t("companyModal.form.name")}
									autoFocus
									name="name"
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
									variant="outlined"
									margin="dense"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Business color="action" />
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div className={classes.multFieldLine}>
								<FormControlLabel
									control={
										<Field
											as={Switch}
											color="primary"
											name="status"
											checked={values.status}
											icon={values.status ? <ToggleOn color="primary" /> : <ToggleOff />}
										/>
									}
									label={values.status ? "Ativo" : "Inativo"}
								/>
							</div>
							<div className={classes.multFieldLine}>
								<Field
									as={TextField}
									label={i18n.t("companyModal.form.email")}
									name="email"
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
									variant="outlined"
									margin="dense"
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Email color="action" />
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div className={classes.multFieldLine}>
								<Field
									as={TextField}
									name="passwordDefault"
									variant="outlined"
									margin="dense"
									label={i18n.t("companyModal.form.passwordDefault")}
									error={touched.passwordDefault && Boolean(errors.passwordDefault)}
									helperText={touched.passwordDefault && errors.passwordDefault}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Security color="action" />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={() => setShowPassword((e) => !e)}
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										)
									}}
									fullWidth
								/>
							</div>
							<div className={classes.multFieldLine}>
								<Field
									as={TextField}
									name="numberAttendants"
									variant="outlined"
									margin="dense"
									label="Número de Atendentes"
									type="number"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<People color="action" />
											</InputAdornment>
										),
									}}
									fullWidth
								/>
							</div>
							<div className={classes.multFieldLine}>
								<Field
									as={TextField}
									name="numberConections"
									variant="outlined"
									margin="dense"
									label="Número de Conexões"
									type="number"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Link color="action" />
											</InputAdornment>
										),
									}}
									fullWidth
								/>
							</div>
						</DialogContent>
						<DialogActions>
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
								variant="outlined"
							>
								{i18n.t("companyModal.buttons.cancel")}
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
								{companyId
									? `${i18n.t("companyModal.buttons.okEdit")}`
									: `${i18n.t("companyModal.buttons.okAdd")}`}
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
	);
};

export default CompanyModal;