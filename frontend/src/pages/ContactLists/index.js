import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/People";
import DownloadIcon from "@material-ui/icons/GetApp";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactListDialog from "../../components/ContactListDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";
import AddIcon from '@mui/icons-material/Add';


import planilhaExemplo from "../../assets/planilha.xlsx";
// import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTLISTS") {
    const contactLists = action.payload;
    const newContactLists = [];

    contactLists.forEach((contactList) => {
      const contactListIndex = state.findIndex((u) => u.id === contactList.id);
      if (contactListIndex !== -1) {
        state[contactListIndex] = contactList;
      } else {
        newContactLists.push(contactList);
      }
    });

    return [...state, ...newContactLists];
  }

  if (action.type === "UPDATE_CONTACTLIST") {
    const contactList = action.payload;
    const contactListIndex = state.findIndex((u) => u.id === contactList.id);

    if (contactListIndex !== -1) {
      state[contactListIndex] = contactList;
      return [...state];
    } else {
      return [contactList, ...state];
    }
  }

  if (action.type === "DELETE_CONTACTLIST") {
    const contactListId = action.payload;

    const contactListIndex = state.findIndex((u) => u.id === contactListId);
    if (contactListIndex !== -1) {
      state.splice(contactListIndex, 1);
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

const ContactLists = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState(null);
  const [deletingContactList, setDeletingContactList] = useState(null);
  const [contactListModalOpen, setContactListModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [contactLists, dispatch] = useReducer(reducer, []);
  //   const socketManager = useContext(SocketContext);
  const { user, socket } = useContext(AuthContext);


  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContactLists = async () => {
        try {
          const { data } = await api.get("/contact-lists/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTLISTS", payload: data.records });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContactLists();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    // const socket = socketManager.GetSocket();

    const onContactListEvent = (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTLIST", payload: data.record });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACTLIST", payload: +data.id });
      }
    };

    socket.on(`company-${companyId}-ContactList`, onContactListEvent);

    return () => {
      socket.off(`company-${companyId}-ContactList`, onContactListEvent);
    };
  }, []);

  const handleOpenContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(true);
  };

  const handleCloseContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditContactList = (contactList) => {
    setSelectedContactList(contactList);
    setContactListModalOpen(true);
  };

  const handleDeleteContactList = async (contactListId) => {
    try {
      await api.delete(`/contact-lists/${contactListId}`);
      toast.success(i18n.t("contactLists.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContactList(null);
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

  const goToContacts = (id) => {
    history.push(`/contact-lists/${id}/contacts`);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingContactList &&
          `${i18n.t("contactLists.confirmationModal.deleteTitle")} ${deletingContactList.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteContactList(deletingContactList.id)}
      >
        {i18n.t("contactLists.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ContactListDialog
        open={contactListModalOpen}
        onClose={handleCloseContactListModal}
        aria-labelledby="form-dialog-title"
        contactListId={selectedContactList && selectedContactList.id}
      />
      <MainHeader>
        <Grid style={{ width: "99.6%" }} container>
          <Grid xs={12} sm={8} item>
            <Title>{i18n.t("contactLists.title")}</Title>
          </Grid>
          <Grid xs={12} sm={4} item>
            <Grid spacing={2} container>
              <Grid xs={7} sm={6} item>
                <TextField
                  fullWidth
                  placeholder={i18n.t("contacts.searchPlaceholder")}
                  type="search"
                  value={searchParam}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{ color: "#FFA500" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid xs={5} sm={6} item>
                <Button
                  fullWidth
                  variant="contained"
                  style={{
                  color: "white",
                  backgroundColor: "#FFA500",
                  boxShadow: "none",
                  borderRadius: "5px",
                  }}
                  onClick={handleOpenContactListModal}
                >
                  {i18n.t("contactLists.buttons.add")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
    contactLists.map((contactList) => (
      <Grid item xs={12} sm={6} md={4} key={contactList.id}>
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
              {contactList.name}
            </Typography>
            <Typography variant="body2" align="center">
              Contatos: {contactList.contactsCount || 0}
            </Typography>
          </CardContent>
<CardActions style={{ justifyContent: "center", gap: "10px" }}>
  <a href={planilhaExemplo} download="planilha.xlsx">
    <IconButton
      size="small"
      title="Baixar Planilha Exemplo"
      style={{
        backgroundColor: "#4ec24e", // Verde
        borderRadius: "10px",
        padding: "8px"
      }}
    >
      <DownloadIcon style={{ color: "white" }} />
    </IconButton>
  </a>

  <IconButton
    size="small"
    onClick={() => goToContacts(contactList.id)}
    style={{
      backgroundColor: "#40BFFF", // Azul claro
      borderRadius: "10px",
      padding: "8px"
    }}
    title="Ver Contatos"
  >
    <PeopleIcon style={{ color: "white" }} />
  </IconButton>

  <IconButton
    size="small"
    onClick={() => handleEditContactList(contactList)}
    style={{
      backgroundColor: "#FFA500", // Laranja
      borderRadius: "10px",
      padding: "8px"
    }}
    title="Editar Lista"
  >
    <EditIcon style={{ color: "white" }} />
  </IconButton>

  <IconButton
    size="small"
    onClick={() => {
      setConfirmModalOpen(true);
      setDeletingContactList(contactList);
    }}
    style={{
      backgroundColor: "#FF6B6B", // Vermelho claro
      borderRadius: "10px",
      padding: "8px"
    }}
    title="Excluir Lista"
  >
    <DeleteOutlineIcon style={{ color: "white" }} />
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

export default ContactLists;
