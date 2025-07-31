import React, { useState, useEffect, useReducer, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { Facebook, Instagram, WhatsApp } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from "@mui/material/Dialog";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import BlockIcon from "@material-ui/icons/Block";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import NewTicketModal from "../../components/NewTicketModal";
import { TagsFilter } from "../../components/TagsFilter";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import formatSerializedId from '../../utils/formatSerializedId';
import { v4 as uuidv4 } from "uuid";
import { ArrowDropDown, Backup, ContactPhone } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";
import ContactImportWpModal from "../../components/ContactImportWpModal";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const markers = [
    { markerOffset: -30, name: "Aracaju", coordinates: [-37.0717, -10.9472] },
    { markerOffset: 15, name: "Belém", coordinates: [-48.4878, -1.4558] },
    { markerOffset: 15, name: "Belo Horizonte", coordinates: [-43.9378, -19.8157] },
    { markerOffset: 15, name: "Boa Vista", coordinates: [-60.6739, 2.8195] },
    { markerOffset: 15, name: "Brasília", coordinates: [-47.8825, -15.7942] },
    { markerOffset: 15, name: "Campo Grande", coordinates: [-54.6464, -20.4428] },
    { markerOffset: 15, name: "Cuiabá", coordinates: [-56.0969, -15.6011] },
    { markerOffset: 15, name: "Curitiba", coordinates: [-49.2736, -25.4296] },
    { markerOffset: 15, name: "Florianópolis", coordinates: [-48.5492, -27.5969] },
    { markerOffset: 15, name: "Fortaleza", coordinates: [-38.5267, -3.71839] },
    { markerOffset: 15, name: "Goiânia", coordinates: [-49.2736, -16.6869] },
    { markerOffset: 15, name: "João Pessoa", coordinates: [-34.8631, -7.1195] },
    { markerOffset: 15, name: "Macapá", coordinates: [-51.0667, 0.0333] },
    { markerOffset: 15, name: "Maceió", coordinates: [-35.7353, -9.6658] },
    { markerOffset: 15, name: "Manaus", coordinates: [-60.025, -3.10194] },
    { markerOffset: 15, name: "Natal", coordinates: [-35.2094, -5.795] },
    { markerOffset: 15, name: "Palmas", coordinates: [-48.3347, -10.1844] },
    { markerOffset: 15, name: "Porto Alegre", coordinates: [-51.23, -30.0331] },
    { markerOffset: 15, name: "Porto Velho", coordinates: [-63.9039, -8.7619] },
    { markerOffset: 15, name: "Recife", coordinates: [-34.8811, -8.05389] },
    { markerOffset: 15, name: "Rio Branco", coordinates: [-67.8099, -9.9747] },
    { markerOffset: 15, name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068] },
    { markerOffset: 15, name: "Salvador", coordinates: [-38.4813, -12.9716] },
    { markerOffset: 15, name: "São Luís", coordinates: [-44.3028, -2.5283] },
    { markerOffset: 15, name: "São Paulo", coordinates: [-46.6333, -23.5505] },
    { markerOffset: 15, name: "Teresina", coordinates: [-42.8039, -5.0892] },
    { markerOffset: 15, name: "Vitória", coordinates: [-40.3378, -20.3194] },
];

// Lista de DDDs e seus estados correspondentes
const dddList = {
    "11": "São Paulo",
    "12": "São Paulo",
    "13": "São Paulo",
    "14": "São Paulo",
    "15": "São Paulo",
    "16": "São Paulo",
    "17": "São Paulo",
    "18": "São Paulo",
    "19": "São Paulo",
    "21": "Rio de Janeiro",
    "22": "Rio de Janeiro",
    "24": "Rio de Janeiro",
    "27": "Espírito Santo",
    "28": "Espírito Santo",
    "31": "Minas Gerais",
    "32": "Minas Gerais",
    "33": "Minas Gerais",
    "34": "Minas Gerais",
    "35": "Minas Gerais",
    "37": "Minas Gerais",
    "38": "Minas Gerais",
    "41": "Paraná",
    "42": "Paraná",
    "43": "Paraná",
    "44": "Paraná",
    "45": "Paraná",
    "46": "Paraná",
    "47": "Santa Catarina",
    "48": "Santa Catarina",
    "49": "Santa Catarina",
    "51": "Rio Grande do Sul",
    "53": "Rio Grande do Sul",
    "54": "Rio Grande do Sul",
    "55": "Rio Grande do Sul",
    "61": "Distrito Federal/Goiás",
    "62": "Goiás",
    "63": "Tocantins",
    "64": "Goiás",
    "65": "Mato Grosso",
    "66": "Mato Grosso",
    "67": "Mato Grosso do Sul",
    "68": "Acre",
    "69": "Rondônia",
    "71": "Bahia",
    "73": "Bahia",
    "74": "Bahia",
    "75": "Bahia",
    "77": "Bahia",
    "79": "Sergipe",
    "81": "Pernambuco",
    "82": "Alagoas",
    "83": "Paraíba",
    "84": "Rio Grande do Norte",
    "85": "Ceará",
    "86": "Piauí",
    "87": "Pernambuco",
    "88": "Ceará",
    "89": "Piauí",
    "91": "Pará",
    "92": "Amazonas",
    "93": "Pará",
    "94": "Pará",
    "95": "Roraima",
    "96": "Amapá",
    "97": "Amazonas",
    "98": "Maranhão",
    "99": "Maranhão",
};

const ExpandableAvatar = ({ contact }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Avatar
                src={`${contact?.urlPicture}`}
                style={{
                    width: "40px",
                    height: "40px",
                    margin: "0 auto",
                    border: "2px solid #4caf50",
                    cursor: "pointer",
                }}
                onClick={handleOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <img
                    src={`${contact?.urlPicture}`}
                    alt="Contact"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                    }}
                />
            </Dialog>
        </>
    );
};

const reducer = (state, action) => {
    if (action.type === "LOAD_CONTACTS") {
        const contacts = action.payload;
        const newContacts = [];

        contacts.forEach((contact) => {
            const contactIndex = state.findIndex((c) => c.id === contact.id);
            if (contactIndex !== -1) {
                state[contactIndex] = contact;
            } else {
                newContacts.push(contact);
            }
        });

        return [...state, ...newContacts];
    }

    if (action.type === "UPDATE_CONTACTS") {
        const contact = action.payload;
        const contactIndex = state.findIndex((c) => c.id === contact.id);

        if (contactIndex !== -1) {
            state[contactIndex] = contact;
            return [...state];
        } else {
            return [contact, ...state];
        }
    }

    if (action.type === "DELETE_CONTACT") {
        const contactId = action.payload;

        const contactIndex = state.findIndex((c) => c.id === contactId);
        if (contactIndex !== -1) {
            state.splice(contactIndex, 1);
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
    legendContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "20px",
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        margin: "5px 10px",
    },
    legendColor: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        marginRight: "5px",
        backgroundColor: "#FFA500",
    },
    totalContactsBar: {
        backgroundColor: "#4CAF50",
        padding: "10px",
        textAlign: "center",
        color: "white",
        marginBottom: "20px",
        borderRadius: "4px",
    },
    legendCard: {
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#e8e8e8",
        borderRadius: "8px",
        boxShadow: "none",
    },
    mobileCardActions: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
    },
    mobileActionButton: {
        width: "100%",
        justifyContent: "flex-start",
    },
}));

const Contacts = () => {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user, socket } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParam, setSearchParam] = useState("");
    const [contacts, dispatch] = useReducer(reducer, []);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const [importContactModalOpen, setImportContactModalOpen] = useState(false);
    const [deletingContact, setDeletingContact] = useState(null);
    const [ImportContacts, setImportContacts] = useState(null);
    const [blockingContact, setBlockingContact] = useState(null);
    const [unBlockingContact, setUnBlockingContact] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [exportContact, setExportContact] = useState(false);
    const [confirmChatsOpen, setConfirmChatsOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
    const [contactTicket, setContactTicket] = useState({});
    const fileUploadRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const { setCurrentTicket } = useContext(TicketsContext);

    const [importWhatsappId, setImportWhatsappId] = useState()

    const { getAll: getAllSettings } = useCompanySettings();
    const [hideNum, setHideNum] = useState(false);
    const [enableLGPD, setEnableLGPD] = useState(false);
    useEffect(() => {
        async function fetchData() {
            const settingList = await getAllSettings(user.companyId);

            for (const [key, value] of Object.entries(settingList)) {
                if (key === "enableLGPD") setEnableLGPD(value === "enabled");
                if (key === "lgpdHideNumber") setHideNum(value === "enabled");
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImportExcel = async () => {
        try {
            const formData = new FormData();
            formData.append("file", fileUploadRef.current.files[0]);
            await api.request({
                url: `/contacts/upload`,
                method: "POST",
                data: formData,
            });
            history.go(0);
        } catch (err) {
            toastError(err);
        }
    };

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam, selectedTags]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchContacts = async () => {
                try {
                    const { data } = await api.get("/contacts/", {
                        params: { searchParam, pageNumber, contactTag: JSON.stringify(selectedTags) },
                    });
                    dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
                    setHasMore(data.hasMore);
                    setLoading(false);
                } catch (err) {
                    toastError(err);
                }
            };
            fetchContacts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber, selectedTags]);

    useEffect(() => {
        const companyId = user.companyId;

        const onContactEvent = (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
            }
        };
        socket.on(`company-${companyId}-contact`, onContactEvent);

        return () => {
            socket.off(`company-${companyId}-contact`, onContactEvent);
        };
    }, [socket]);

    const handleSelectTicket = (ticket) => {
        const code = uuidv4();
        const { id, uuid } = ticket;
        setCurrentTicket({ id, uuid, code });
    }

    const handleCloseOrOpenTicket = (ticket) => {
        setNewTicketModalOpen(false);
        if (ticket !== undefined && ticket.uuid !== undefined) {
            handleSelectTicket(ticket);
            history.push(`/tickets/${ticket.uuid}`);
        }
    };

    const handleSelectedTags = (selecteds) => {
        const tags = selecteds.map((t) => t.id);
        setSelectedTags(tags);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleOpenContactModal = () => {
        setSelectedContactId(null);
        setContactModalOpen(true);
    };

    const handleCloseContactModal = () => {
        setSelectedContactId(null);
        setContactModalOpen(false);
    };

    const hadleEditContact = (contactId) => {
        setSelectedContactId(contactId);
        setContactModalOpen(true);
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await api.delete(`/contacts/${contactId}`);
            toast.success(i18n.t("contacts.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
    };

    const handleBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: false });
            toast.success("Contato bloqueado");
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
        setBlockingContact(null);
    };

    const handleUnBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: true });
            toast.success("Contato desbloqueado");
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
        setUnBlockingContact(null);
    };

    const onSave = (whatsappId) => {
        setImportWhatsappId(whatsappId)
    }

    const handleimportContact = async () => {
        setImportContactModalOpen(false)

        try {
            await api.post("/contacts/import", { whatsappId: importWhatsappId });
            history.go(0);
            setImportContactModalOpen(false);
        } catch (err) {
            toastError(err);
            setImportContactModalOpen(false);
        }
    };

    const handleimportChats = async () => {
        console.log("handleimportChats")
        try {
            await api.post("/contacts/import/chats");
            history.go(0);
        } catch (err) {
            toastError(err);
        }
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

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Função para contar contatos por estado
    const countContactsByState = () => {
        const stateCounts = {};

        contacts.forEach(contact => {
            const number = contact.number;
            if (number && number.length > 2) {
                const ddd = number.substring(2, 4); // Extrai os dígitos 3 e 4 (DDD após o código do país)
                if (dddList[ddd]) {
                    const state = dddList[ddd];
                    if (!stateCounts[state]) {
                        stateCounts[state] = 0;
                    }
                    stateCounts[state]++;
                } else {
                    // Se o DDD não estiver na lista de DDDs do Brasil, adiciona à categoria "Outros"
                    if (!stateCounts["Outros"]) {
                        stateCounts["Outros"] = 0;
                    }
                    stateCounts["Outros"]++;
                }
            }
        });

        return stateCounts;
    };

    const stateCounts = countContactsByState();

    const renderCardActions = (contact) => {
        if (isMobile) {
            return (
                <CardActions className={classes.mobileCardActions}>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={!contact.active}
                        onClick={() => {
                            setContactTicket(contact);
                            setNewTicketModalOpen(true);
                        }}
                        startIcon={<WhatsApp />}
                        style={{
                            backgroundColor: "#25D366",
                            color: "#fff",
                        }}
                        className={classes.mobileActionButton}
                    >
                        WhatsApp
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => hadleEditContact(contact.id)}
                        startIcon={<EditIcon />}
                        style={{
                            backgroundColor: "#42A5F5",
                            color: "#fff",
                        }}
                        className={classes.mobileActionButton}
                    >
                        Editar
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                            contact.active
                                ? (setConfirmOpen(true), setBlockingContact(contact))
                                : (setConfirmOpen(true), setUnBlockingContact(contact))
                        }
                        startIcon={contact.active ? <BlockIcon /> : <CheckCircleIcon />}
                        style={{
                            backgroundColor: contact.active ? "#FFA726" : "#66BB6A",
                            color: "#fff",
                        }}
                        className={classes.mobileActionButton}
                    >
                        {contact.active ? "Bloquear" : "Desbloquear"}
                    </Button>
                    
                    <Can
                        role={user.profile}
                        perform="contacts-page:deleteContact"
                        yes={() => (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setConfirmOpen(true);
                                    setDeletingContact(contact);
                                }}
                                startIcon={<DeleteOutlineIcon />}
                                style={{
                                    backgroundColor: "#FF6B6B",
                                    color: "#fff",
                                }}
                                className={classes.mobileActionButton}
                            >
                                Deletar
                            </Button>
                        )}
                    />
                </CardActions>
            );
        } else {
            return (
                <CardActions style={{ padding: "8px", justifyContent: "space-around" }}>
                    <IconButton
                        size="small"
                        disabled={!contact.active}
                        onClick={() => {
                            setContactTicket(contact);
                            setNewTicketModalOpen(true);
                        }}
                        style={{
                            backgroundColor: "#25D366",
                            borderRadius: "10px",
                            padding: "8px"
                        }}
                    >
                        <WhatsApp style={{ color: "#fff" }} />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={() => hadleEditContact(contact.id)}
                        style={{
                            backgroundColor: "#42A5F5",
                            borderRadius: "10px",
                            padding: "8px"
                        }}
                    >
                        <EditIcon style={{ color: "#fff" }} />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={() =>
                            contact.active
                                ? (setConfirmOpen(true), setBlockingContact(contact))
                                : (setConfirmOpen(true), setUnBlockingContact(contact))
                        }
                        style={{
                            backgroundColor: contact.active ? "#FFA726" : "#66BB6A",
                            borderRadius: "10px",
                            padding: "8px"
                        }}
                    >
                        {contact.active ? (
                            <BlockIcon style={{ color: "#fff" }} />
                        ) : (
                            <CheckCircleIcon style={{ color: "#fff" }} />
                        )}
                    </IconButton>

                    <Can
                        role={user.profile}
                        perform="contacts-page:deleteContact"
                        yes={() => (
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setConfirmOpen(true);
                                    setDeletingContact(contact);
                                }}
                                style={{
                                    backgroundColor: "#FF6B6B",
                                    borderRadius: "10px",
                                    padding: "8px"
                                }}
                            >
                                <DeleteOutlineIcon style={{ color: "#fff" }} />
                            </IconButton>
                        )}
                    />
                </CardActions>
            );
        }
    };

    return (
        <MainContainer className={classes.mainContainer}>
            <NewTicketModal
                modalOpen={newTicketModalOpen}
                initialContact={contactTicket}
                onClose={(ticket) => {
                    handleCloseOrOpenTicket(ticket);
                }}
            />
            <ContactModal
                open={contactModalOpen}
                onClose={handleCloseContactModal}
                aria-labelledby="form-dialog-title"
                contactId={selectedContactId}
            ></ContactModal>
            <ConfirmationModal
                title={
                    deletingContact
                        ? `${i18n.t(
                            "contacts.confirmationModal.deleteTitle"
                        )} ${deletingContact.name}?`
                        : blockingContact
                            ? `Bloquear Contato ${blockingContact.name}?`
                            : unBlockingContact
                                ? `Desbloquear Contato ${unBlockingContact.name}?`
                                : ImportContacts
                                    ? `${i18n.t("contacts.confirmationModal.importTitlte")}`
                                    : `${i18n.t("contactListItems.confirmationModal.importTitlte")}`
                }
                onSave={onSave}
                isCellPhone={ImportContacts}
                open={confirmOpen}
                onClose={setConfirmOpen}
                onConfirm={(e) =>
                    deletingContact
                        ? handleDeleteContact(deletingContact.id)
                        : blockingContact
                            ? handleBlockContact(blockingContact.id)
                            : unBlockingContact
                                ? handleUnBlockContact(unBlockingContact.id)
                                : ImportContacts
                                    ? handleimportContact()
                                    : handleImportExcel()
                }
            >
                {exportContact
                    ?
                    `${i18n.t("contacts.confirmationModal.exportContact")}`
                    : deletingContact
                        ? `${i18n.t("contacts.confirmationModal.deleteMessage")}`
                        : blockingContact
                            ? `${i18n.t("contacts.confirmationModal.blockContact")}`
                            : unBlockingContact
                                ? `${i18n.t("contacts.confirmationModal.unblockContact")}`
                                : ImportContacts
                                    ? `Escolha de qual conexão deseja importar`
                                    : `${i18n.t(
                                        "contactListItems.confirmationModal.importMessage"
                                    )}`}
            </ConfirmationModal>
            <ConfirmationModal
                title={i18n.t("contacts.confirmationModal.importChat")}
                open={confirmChatsOpen}
                onClose={setConfirmChatsOpen}
                onConfirm={(e) => handleimportChats()}
            >
                {i18n.t("contacts.confirmationModal.wantImport")}
            </ConfirmationModal>
            <MainHeader>
                <Title>{i18n.t("contacts.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <TagsFilter
                        onFiltered={handleSelectedTags}
                    />
                    <TextField
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
                        style={{ width: isMobile ? "100%" : "auto" }}
                    />
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button
                                    variant="contained"
                                    startIcon={<FileUploadIcon />}
                                    style={{
                                        color: "white",
                                        backgroundColor: "#4ec24e",
                                        boxShadow: "none",
                                        borderRadius: "5px",
                                        margin: isMobile ? "8px 0" : "0 8px"
                                    }}
                                    {...bindTrigger(popupState)}
                                >
                                    {isMobile ? "Importar" : "Importar/Exportar"}
                                    {!isMobile && <ArrowDropDown />}
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem
                                        onClick={() => {
                                            setConfirmOpen(true);
                                            setImportContacts(true);
                                            popupState.close();
                                        }}
                                    >
                                        <ContactPhone
                                            fontSize="small"
                                            color="primary"
                                            style={{
                                                marginRight: 10,
                                            }}
                                        />
                                        {i18n.t("contacts.menu.importYourPhone")}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => { setImportContactModalOpen(true) }}
                                    >
                                        <Backup
                                            fontSize="small"
                                            color="primary"
                                            style={{
                                                marginRight: 10,
                                            }}
                                        />
                                        {i18n.t("contacts.menu.importToExcel")}
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        style={{
                            color: "white",
                            backgroundColor: "#437db5",
                            boxShadow: "none",
                            borderRadius: "5px",
                            margin: isMobile ? "8px 0" : "0"
                        }}
                        onClick={handleOpenContactModal}
                    >
                        {i18n.t("contacts.buttons.add")}
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>

            {importContactModalOpen && (
                <ContactImportWpModal
                    isOpen={importContactModalOpen}
                    handleClose={() => setImportContactModalOpen(false)}
                    selectedTags={selectedTags}
                    hideNum={hideNum}
                    userProfile={user.profile}
                />
            )}
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="abas">
                <Tab label="Contatos" />
                <Tab label="Mapa" />
            </Tabs>
            <Paper
                className={classes.mainPaper}
                variant="outlined"
                onScroll={handleScroll}
            >
                {tabValue === 0 && (
                    <>
                        <input
                            style={{ display: "none" }}
                            id="upload"
                            name="file"
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={() => {
                                setConfirmOpen(true);
                            }}
                            ref={fileUploadRef}
                        />
                        <Box className={classes.totalContactsBar}>
                            <Typography variant="h6">
                                Total de Contatos: {contacts.length}
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {contacts.map((contact) => (
                                <Grid
                                    item xs={12} sm={6} md={4} lg={3} key={contact.id}>
                                    <Card
                                        variant="outlined"
                                        style={{
                                            backgroundColor: "#d7e0e4",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            margin: "5px",
                                            transition: "transform 0.2s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    >
                                        <CardHeader
                                            avatar={<ExpandableAvatar contact={contact} />}
                                            title={contact.name}
                                            subheader={contact.email}
                                            style={{ padding: "8px" }}
                                        />
                                        <CardContent style={{ padding: "8px" }}>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary">
                                                {enableLGPD && hideNum && user.profile === "user"
                                                    ? contact.isGroup
                                                        ? contact.number
                                                        : formatSerializedId(contact?.number) === null
                                                            ? contact.number.slice(0, -6) + "**-**" + contact?.number.slice(-2)
                                                            : formatSerializedId(contact?.number)?.slice(0, -6) + "**-**" + contact?.number?.slice(-2)
                                                    : contact.isGroup
                                                        ? contact.number
                                                        : formatSerializedId(contact?.number)}
                                            </Typography>
                                            <Typography variant="body2">
                                                WhatsApp: {contact?.whatsapp?.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                Status:{" "}
                                                {contact.active ? (
                                                    <CheckCircleIcon style={{ color: "green" }} fontSize="small" />
                                                ) : (
                                                    <CancelIcon style={{ color: "#6959CD" }} fontSize="small" />
                                                )}
                                            </Typography>
                                        </CardContent>
                                        {renderCardActions(contact)}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
                {tabValue === 1 && (
                    <>
                        <Box className={classes.totalContactsBar}>
                            <Typography variant="h6">
                                Total de Contatos por Estado: {contacts.length}
                            </Typography>
                        </Box>
                        <Box p={3}>
                            <Card className={classes.legendCard}>
                                <CardContent>
                                    <Box className={classes.legendContainer}>
                                        {Object.entries(stateCounts).map(([state, count]) => (
                                            <Box key={state} className={classes.legendItem}>
                                                <div className={classes.legendColor} />
                                                <Typography variant="body2">
                                                    {state}: {count} contato(s)
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>

                            <ComposableMap
                                projection="geoMercator"
                                projectionConfig={{
                                    scale: 600,
                                    center: [-53, -15],
                                }}
                                style={{ width: "100%", height: "auto" }}
                            >
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) =>
                                        geographies.map((geo) => {
                                            const state = geo.properties.name;
                                            const count = stateCounts[state] || 0;

                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={count > 0 ? "#FFA500" : "#EAEAEC"}
                                                    stroke="#D6D6DA"
                                                    style={{
                                                        hover: {
                                                            fill: "#FFA500",
                                                            stroke: "#D6D6DA",
                                                        },
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                </Geographies>
                                {markers.map(({ name, coordinates, markerOffset }) => (
                                    <Marker key={name} coordinates={coordinates}>
                                        <circle r={5} fill="#F00" stroke="#fff" strokeWidth={1} />
                                        <text
                                            textAnchor="middle"
                                            y={markerOffset}
                                            style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "12px" }}
                                        >
                                            {name}
                                        </text>
                                        {stateCounts[name] && (
                                            <text
                                                textAnchor="middle"
                                                y={markerOffset + 15}
                                                style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px" }}
                                            >
                                                {stateCounts[name]} contatos
                                            </text>
                                        )}
                                    </Marker>
                                ))}
                            </ComposableMap>
                        </Box>
                    </>
                )}
            </Paper>
        </MainContainer >
    );
};

export default Contacts;