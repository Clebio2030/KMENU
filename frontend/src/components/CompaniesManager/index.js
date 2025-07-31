import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  IconButton,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  CardActions,
  InputAdornment,
  Slide,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";
import Draggable from "react-draggable";
import { Edit as EditIcon } from "@material-ui/icons";
import { toast } from "react-toastify";
import useCompanies from "../../hooks/useCompanies";
import usePlans from "../../hooks/usePlans";
import ModalUsers from "../ModalUsers";
import api from "../../services/api";
import { head, isArray } from "lodash";
import { useDate } from "../../hooks/useDate";
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import RepeatIcon from '@mui/icons-material/Repeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from "moment";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "2px",
  },
  mainPaper: {
    width: "100%",
    flex: 1,
  },
  fullWidth: {
    width: "100%",
  },
  textfield: {
    width: "100%",
  },
  textRight: {
    textAlign: "right",
  },
  buttonContainer: {
    textAlign: "right",
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    cursor: "move",
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
  dialogActions: {
    padding: theme.spacing(2),
  },
  card: {
    minWidth: 150,
    margin: theme.spacing(0.5),
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "none",
  },
  avatar: {
    backgroundColor: "#3f51b5",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  cardContent: {
    padding: theme.spacing(0.5),
  },
  cardActions: {
    justifyContent: "flex-end",
    padding: theme.spacing(0.5),
  },
  smallText: {
    fontSize: "0.75rem",
  },
  companyName: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#1976d2",
  },
  iconColor: {
    color: theme.palette.primary.main,
  },
  whiteBackground: {
    backgroundColor: "#ffffff",
  },
}));

// Adicionando o componente de transição Slide
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DraggablePaper(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export function CompanyForm(props) {
  const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
  const classes = useStyles();
  const [plans, setPlans] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [firstUser, setFirstUser] = useState({});

  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    dueDate: "",
    recurrence: "",
    password: "",
    document: "",
    paymentMethod: "",
    ...initialValue,
  });

  const { list: listPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setRecord((prev) => {
      if (moment(initialValue).isValid()) {
        initialValue.dueDate = moment(initialValue.dueDate).format("YYYY-MM-DD");
      }
      return {
        ...prev,
        ...initialValue,
      };
    });
  }, [initialValue]);

  const handleSubmit = async (data) => {
    if (data.dueDate === "" || moment(data.dueDate).isValid() === false) {
      data.dueDate = null;
    }
    onSubmit(data);
    setRecord({ ...initialValue, dueDate: "" });
  };

  const handleOpenModalUsers = async () => {
    try {
      const { data } = await api.get("/users/list", {
        params: {
          companyId: initialValue.id,
        },
      });
      if (isArray(data) && data.length) {
        setFirstUser(head(data));
      }
      setModalUser(true);
    } catch (e) {
      toast.error(e);
    }
  };

  const handleCloseModalUsers = () => {
    setFirstUser({});
    setModalUser(false);
  };

  const incrementDueDate = () => {
    const data = { ...record };
    if (data.dueDate !== "" && data.dueDate !== null) {
      switch (data.recurrence) {
        case "MENSAL":
          data.dueDate = moment(data.dueDate).add(1, "month").format("YYYY-MM-DD");
          break;
        case "BIMESTRAL":
          data.dueDate = moment(data.dueDate).add(2, "month").format("YYYY-MM-DD");
          break;
        case "TRIMESTRAL":
          data.dueDate = moment(data.dueDate).add(3, "month").format("YYYY-MM-DD");
          break;
        case "SEMESTRAL":
          data.dueDate = moment(data.dueDate).add(6, "month").format("YYYY-MM-DD");
          break;
        case "ANUAL":
          data.dueDate = moment(data.dueDate).add(12, "month").format("YYYY-MM-DD");
          break;
        default:
          break;
      }
    }
    setRecord(data);
  };

  return (
    <>
      <ModalUsers
        userId={firstUser.id}
        companyId={initialValue.id}
        open={modalUser}
        onClose={handleCloseModalUsers}
      />

      <Formik
        enableReinitialize
        className={classes.fullWidth}
        initialValues={record}
        onSubmit={(values, { resetForm }) =>
          setTimeout(() => {
            handleSubmit(values);
            resetForm();
          }, 500)
        }
      >
        {(values, setValues) => (
          <Form className={classes.fullWidth}>
            <Grid container spacing={3} style={{ padding: "16px" }}>
              {/* Campo Nome */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.name")}
                  name="name"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Email */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.email")}
                  name="email"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Senha */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.password")}
                  name="password"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Telefone */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.phone")}
                  name="phone"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Plano */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  className={classes.whiteBackground}
                >
                  <InputLabel htmlFor="plan-selection">
                    {i18n.t("compaies.table.plan")}
                  </InputLabel>
                  <Field 
                    as={Select} 
                    id="plan-selection" 
                    name="planId"
                    startAdornment={
                      <InputAdornment position="start">
                        <DescriptionIcon className={classes.iconColor} />
                      </InputAdornment>
                    }
                  >
                    {plans.map((plan, key) => (
                      <MenuItem key={key} value={plan.id}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* Campo Ativo */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  className={classes.whiteBackground}
                >
                  <InputLabel htmlFor="status-selection">
                    {i18n.t("compaies.table.active")}
                  </InputLabel>
                  <Field 
                    as={Select} 
                    id="status-selection" 
                    name="status"
                    startAdornment={
                      <InputAdornment position="start">
                        <CheckCircleIcon className={classes.iconColor} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={true}>{i18n.t("compaies.table.yes")}</MenuItem>
                    <MenuItem value={false}>{i18n.t("compaies.table.no")}</MenuItem>
                  </Field>
                </FormControl>
              </Grid>

              {/* Campo Documento */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.document")}
                  name="document"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Data de Vencimento */}
              <Grid item xs={12} sm={6} md={4}>
                <Field
                  as={TextField}
                  label={i18n.t("compaies.table.dueDate")}
                  name="dueDate"
                  type="date"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon className={classes.iconColor} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                  className={classes.whiteBackground}
                />
              </Grid>

              {/* Campo Recorrência */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  className={classes.whiteBackground}
                >
                  <InputLabel htmlFor="recurrence-selection">
                    {i18n.t("compaies.table.recurrence")}
                  </InputLabel>
                  <Field 
                    as={Select} 
                    id="recurrence-selection" 
                    name="recurrence"
                    startAdornment={
                      <InputAdornment position="start">
                        <RepeatIcon className={classes.iconColor} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="MENSAL">{i18n.t("compaies.table.monthly")}</MenuItem>
                    <MenuItem value="BIMESTRAL">{i18n.t("compaies.table.bimonthly")}</MenuItem>
                    <MenuItem value="TRIMESTRAL">{i18n.t("compaies.table.quarterly")}</MenuItem>
                    <MenuItem value="SEMESTRAL">{i18n.t("compaies.table.semester")}</MenuItem>
                    <MenuItem value="ANUAL">{i18n.t("compaies.table.yearly")}</MenuItem>
                  </Field>
                </FormControl>
              </Grid>

              {/* Campo Método de Pagamento */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  className={classes.whiteBackground}
                >
                  <InputLabel htmlFor="paymentMethod-selection">
                    {i18n.t("Método de Pagamento")}
                  </InputLabel>
                  <Field 
                    as={Select} 
                    id="paymentMethod-selection" 
                    name="paymentMethod"
                    startAdornment={
                      <InputAdornment position="start">
                        <PaymentIcon className={classes.iconColor} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="CREDIT_CARD">Cartão de Crédito</MenuItem>
                    <MenuItem value="BOLETO">Boleto</MenuItem>
                    <MenuItem value="PIX">PIX</MenuItem>
                    <MenuItem value="CORTESIA">Cortesia</MenuItem>
                  </Field>
                </FormControl>
              </Grid>

              {/* Botões de Ação */}
              <Grid item xs={12}>
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <ButtonWithSpinner
                      startIcon={<ClearIcon />}
                      style={{
                        color: "white",
                        backgroundColor: "#FFA500",
                        borderRadius: "5px",
                        boxShadow: "none",
                      }}
                      loading={loading}
                      onClick={onCancel}
                      variant="contained"
                    >
                      {i18n.t("compaies.table.clear")}
                    </ButtonWithSpinner>
                  </Grid>
                  {record.id !== undefined && (
                    <>
                      <Grid item>
                        <ButtonWithSpinner
                          startIcon={<DeleteIcon />}
                          style={{
                            color: "white",
                            backgroundColor: "#db6565",
                            borderRadius: "5px",
                            boxShadow: "none",
                          }}
                          loading={loading}
                          onClick={() => onDelete(record)}
                          variant="contained"
                        >
                          {i18n.t("compaies.table.delete")}
                        </ButtonWithSpinner>
                      </Grid>
                      <Grid item>
                        <ButtonWithSpinner
                          startIcon={<CalendarTodayIcon />}
                          style={{
                            color: "white",
                            backgroundColor: "#8A2BE2",
                            borderRadius: "5px",
                            boxShadow: "none",
                          }}
                          loading={loading}
                          onClick={incrementDueDate}
                          variant="contained"
                        >
                          {i18n.t("compaies.table.dueDate")}
                        </ButtonWithSpinner>
                      </Grid>
                    </>
                  )}
                  <Grid item>
                    <ButtonWithSpinner
                      startIcon={<SaveIcon />}
                      style={{
                        color: "white",
                        backgroundColor: "#437db5",
                        borderRadius: "5px",
                        boxShadow: "none",
                      }}
                      loading={loading}
                      type="submit"
                      variant="contained"
                    >
                      {i18n.t("compaies.table.save")}
                    </ButtonWithSpinner>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}

export function CompaniesManagerGrid(props) {
  const { records, onSelect } = props;
  const classes = useStyles();
  const { dateToClient, datetimeToClient } = useDate();

  const renderStatus = (row) => {
    return row.status === false ? "Não" : "Sim";
  };

  const renderPlan = (row) => {
    return row.planId !== null ? row.plan.name : "-";
  };

  const renderPlanValue = (row) => {
    return row.planId !== null ? row.plan.amount ? row.plan.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00' : "-";
  };

  const rowStyle = (record) => {
    if (moment(record.dueDate).isValid()) {
      const now = moment();
      const dueDate = moment(record.dueDate);
      const diff = dueDate.diff(now, "days");
      if (diff >= 1 && diff <= 5) {
        return { backgroundColor: "#fffead" };
      }
      if (diff <= 0) {
        return { backgroundColor: "#fa8c8c" };
      }
    }
    return {};
  };

  return (
    <Grid container spacing={1}>
      {records.map((row, key) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card className={classes.card} style={rowStyle(row)}>
            <CardContent className={classes.cardContent}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="h2" className={classes.companyName}>
                    {row.name || "-"}
                  </Typography>
                </Grid>
              </Grid>
              <Typography color="textSecondary" gutterBottom className={classes.smallText}>
                {row.email || "-"}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Telefone:</strong> {row.phone || "-"}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Plano:</strong> {renderPlan(row)}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Valor:</strong> {i18n.t("compaies.table.money")} {renderPlanValue(row)}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Ativo:</strong> {renderStatus(row)}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Criado em:</strong> {dateToClient(row.createdAt)}
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Vencimento:</strong> {dateToClient(row.dueDate)} <br />
                <span>{row.recurrence}</span>
              </Typography>
              <Typography variant="body2" component="p" className={classes.smallText}>
                <strong>Último Login:</strong> {datetimeToClient(row.lastLogin)}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions} style={{ justifyContent: "center" }}>
              <IconButton
                onClick={() => onSelect(row)}
                aria-label="edit"
                style={{
                  backgroundColor: "#3DB8FF",
                  borderRadius: "10px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <EditIcon style={{ color: "#fff" }} />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function CompaniesManager() {
  const classes = useStyles();
  const { list, save, update, remove } = useCompanies();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    dueDate: "",
    recurrence: "",
    password: "",
    document: "",
    paymentMethod: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    const filtered = records.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const companyList = await list();
      setRecords(companyList);
      setFilteredRecords(companyList);
    } catch (e) {
      toast.error("Não foi possível carregar a lista de registros");
    }
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.id !== undefined) {
        await update(data);
      } else {
        await save(data);
      }
      await loadPlans();
      handleCancel();
      toast.success("Operação realizada com sucesso!");
    } catch (e) {
      toast.error(
        "Não foi possível realizar a operação. Verifique se já existe uma empresa com o mesmo nome ou se os campos foram preenchidos corretamente"
      );
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await remove(record.id);
      await loadPlans();
      handleCancel();
      toast.success("Operação realizada com sucesso!");
    } catch (e) {
      toast.error("Não foi possível realizar a operação");
    }
    setLoading(false);
  };

  const handleOpenDeleteDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setRecord({
      name: "",
      email: "",
      phone: "",
      planId: "",
      status: true,
      dueDate: "",
      recurrence: "",
      password: "",
      document: "",
      paymentMethod: ""
    });
    setOpenEditDialog(false);
  };

  const handleSelect = (data) => {
    setRecord({
      id: data.id,
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      planId: data.planId || "",
      status: data.status === false ? false : true,
      dueDate: data.dueDate || "",
      recurrence: data.recurrence || "",
      password: "",
      document: data.document || "",
      paymentMethod: data.paymentMethod || "",
    });
    setOpenEditDialog(true);
  };

  return (
    <Paper className={classes.mainPaper} elevation={0}>
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <TextField
            label="Buscar por nome"
            variant="outlined"
            margin="dense"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "16px" }}
            className={classes.whiteBackground}
          />
        </Grid>
        <Grid xs={12} item>
          <CompaniesManagerGrid records={filteredRecords} onSelect={handleSelect} />
        </Grid>
      </Grid>

      <Dialog
        open={openEditDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperComponent={DraggablePaper}
        TransitionComponent={Transition} // Adicionando o efeito de transição
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="draggable-dialog-title" className={classes.dialogTitle}>
          Editar Empresa
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <CompanyForm
            initialValue={record}
            onDelete={handleOpenDeleteDialog}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={handleCancel}
            style={{
              backgroundColor: "#e3a3a3",
              color: "white",
              borderRadius: "5px",
              boxShadow: "none",
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationModal
        title="Exclusão de Registro"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => handleDelete()}
      >
        Deseja realmente excluir esse registro?
      </ConfirmationModal>
    </Paper>
  );
}