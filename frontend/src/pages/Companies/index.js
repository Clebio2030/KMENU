import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
// import { SocketContext } from "../../context/Socket/SocketContext";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";

import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import CompanyModal from "../../components/CompaniesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import usePlans from "../../hooks/usePlans";
import moment from "moment";

const reducer = (state, action) => {
    if (action.type === "LOAD_COMPANIES") {
        const companies = action.payload;
        const newCompanies = [];

        companies.forEach((company) => {
            const companyIndex = state.findIndex((u) => u.id === company.id);
            if (companyIndex !== -1) {
                state[companyIndex] = company;
            } else {
                newCompanies.push(company);
            }
        });

        return [...state, ...newCompanies];
    }

    if (action.type === "UPDATE_COMPANIES") {
        const company = action.payload;
        const companyIndex = state.findIndex((u) => u.id === company.id);

        if (companyIndex !== -1) {
            state[companyIndex] = company;
            return [...state];
        } else {
            return [company, ...state];
        }
    }

    if (action.type === "DELETE_COMPANIES") {
        const companyId = action.payload;

        const companyIndex = state.findIndex((u) => u.id === companyId);
        if (companyIndex !== -1) {
            state.splice(companyIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

const useStyles = makeStyles((theme) => ({
    mainPaper: {
        flex: 1,
        padding: theme.spacing(1),
        overflowY: "scroll",
        ...theme.scrollbarStyles,
    },
}));

const Companies = () => {
    const classes = useStyles();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [deletingCompany, setDeletingCompany] = useState(null);
    const [companyModalOpen, setCompanyModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [companies, dispatch] = useReducer(reducer, []);
    const { dateToClient, datetimeToClient } = useDate();

    // const { getPlanCompany } = usePlans();
  //   const socketManager = useContext(SocketContext);
    const { user, socket } = useContext(AuthContext);


    useEffect(() => {
        async function fetchData() {
            if (!user.super) {
                toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
                setTimeout(() => {
                    history.push(`/`)
                }, 1000);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchCompanies = async () => {
                try {
                    const { data } = await api.get("/companiesPlan/", {
                        params: { searchParam, pageNumber },
                    });
                    dispatch({ type: "LOAD_COMPANIES", payload: data.companies });
                    setHasMore(data.hasMore);
                    setLoading(false);
                } catch (err) {
                    toastError(err);
                }
            };
            fetchCompanies();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber]);

//     useEffect(() => {
//         const companyId = user.companyId;
//   //    const socket = socketManager.GetSocket();
//         // const socket = socketConnection();

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

    const handleOpenCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(true);
    };

    const handleCloseCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditCompany = (company) => {
        setSelectedCompany(company);
        setCompanyModalOpen(true);
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            await api.delete(`/companies/${companyId}`);
            toast.success(i18n.t("compaies.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingCompany(null);
        setSearchParam("");
        setPageNumber(1);
    };

    const loadMore = () => {
        setPageNumber((prevState) => prevState + 1);
    };

    const handleScroll = (e) => {
        if (!hasMore || loading) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - (scrollTop + 100) < clientHeight) {
            loadMore();
        }
    };

    const renderStatus = (row) => {
        return row.status === false ? "Não" : "Sim";
    };

    const renderPlanValue = (row) => {
        return row.planId !== null ? row.plan.amount ? row.plan.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00' : "-";
    };

    const renderWhatsapp = (row) => {
        return row.useWhatsapp === false ? "Não" : "Sim";
    };

    const renderFacebook = (row) => {
        return row.useFacebook === false ? "Não" : "Sim";
    };

    const renderInstagram = (row) => {
        return row.useInstagram === false ? "Não" : "Sim";
    };

    const renderCampaigns = (row) => {
        return row.useCampaigns === false ? "Não" : "Sim";
    };

    const renderSchedules = (row) => {
        return row.useSchedules === false ? "Não" : "Sim";
    };

    const renderInternalChat = (row) => {
        return row.useInternalChat === false ? "Não" : "Sim";
    };

    const renderExternalApi = (row) => {
        return row.useExternalApi === false ? "Não" : "Sim";
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
            // else {
            //   return { backgroundColor: "#affa8c" };
            // }
        }
        return {};
    };

    return (
        <MainContainer>
            <ConfirmationModal
                title={
                    deletingCompany &&
                    `${i18n.t("compaies.confirmationModal.deleteTitle")} ${deletingCompany.name}?`
                }
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteCompany(deletingCompany.id)}
            >
                {i18n.t("compaies.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <CompanyModal
                open={companyModalOpen}
                onClose={handleCloseCompanyModal}
                aria-labelledby="form-dialog-title"
                companyId={selectedCompany && selectedCompany.id}
            />
            <MainHeader>
                <Title>{i18n.t("compaies.title")} ({companies.length})</Title>
                {/* <MainHeaderButtonsWrapper>
                    <TextField
                        placeholder={i18n.t("contacts.searchPlaceholder")}
                        type="search"
                        value={searchParam}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon style={{ color: "gray" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCompanyModal}
                    >
                        {i18n.t("compaies.buttons.add")}
                    </Button>
                </MainHeaderButtonsWrapper> */}
            </MainHeader>
            <Paper
                className={classes.mainPaper}
                variant="outlined"
                onScroll={handleScroll}
            >
<Grid container spacing={2}>
  {loading ? (
    <Grid item xs={12}>
      <Card
       variant="outlined"
       style={{
       backgroundColor: "#d7e0e4",
       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
       borderRadius: "10px",
       padding: "20px",
       margin: "10px",
       transition: "transform 0.2s ease-in-out",
       cursor: "pointer",
        }}
       onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
       onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
       >
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Carregando...
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ) : (
    companies.map((company) => (
      <Grid item xs={12} sm={6} md={4} key={company.id}>
        <Card
       variant="outlined"
       style={{
       backgroundColor: "#d7e0e4",
       boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
       borderRadius: "10px",
       padding: "20px",
       margin: "10px",
       transition: "transform 0.2s ease-in-out",
       cursor: "pointer",
        }}
       onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
       onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
       >
          <CardContent>
            <Typography variant="h6" color="textPrimary" align="center">
              {company.name}
            </Typography>

            <Typography variant="body2" align="center">
              Status: {renderStatus(company.status)}
            </Typography>
            <Typography variant="body2" align="center">
              Email: {company.email}
            </Typography>
            <Typography variant="body2" align="center">
              Plano: {company?.plan?.name}
            </Typography>
            <Typography variant="body2" align="center">
              Valor: R$ {renderPlanValue(company)}
            </Typography>
            <Typography variant="body2" align="center">
              Criado em: {dateToClient(company.createdAt)}
            </Typography>
            <Typography variant="body2" align="center">
              Data de Venc.: {dateToClient(company.dueDate)} <br />
              <span>{company.recurrence}</span>
            </Typography>
            <Typography variant="body2" align="center">
              Último Login: {datetimeToClient(company.lastLogin)}
            </Typography>
            <Typography variant="body2" align="center">
              Tamanho da Pasta: {company.folderSize}
            </Typography>
            <Typography variant="body2" align="center">
              Total de Arquivos: {company.numberFileFolder}
            </Typography>
            <Typography variant="body2" align="center">
              Última Atualização: {datetimeToClient(company.updatedAtFolder)}
            </Typography>
          </CardContent>
<CardActions style={{ justifyContent: "center" }}>
  <IconButton
    size="small"
    onClick={() => handleEditCompany(company)}
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

  >
    <EditIcon style={{ color: "#fff" }} />
  </IconButton>

  <IconButton
    size="small"
    onClick={() => {
      setConfirmModalOpen(true);
      setDeletingCompany(company);
    }}
    style={{
      backgroundColor: "#FF6B6B",
      borderRadius: "10px",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "0.3s",
    }}
  >
    <DeleteOutlineIcon style={{ color: "#fff" }} />
  </IconButton>
</CardActions>

        </Card>
      </Grid>
    ))
  )}
</Grid>
            </Paper>
        </MainContainer>
    );
};

export default Companies;
