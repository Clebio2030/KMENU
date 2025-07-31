import React, { useContext, useEffect, useState } from "react";
import {
  makeStyles,
  Modal,
  Backdrop,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  LinearProgress,
  Chip,
  Slide,
  Box,
  TextField,
  InputAdornment
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Label as LabelIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from "@material-ui/icons";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    padding: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[24],
    padding: 0,
    borderRadius: "8px",
    overflow: "hidden",
    maxHeight: "90vh",
    width: "90%",
    maxWidth: "1200px",
    border: "none",
    "&:focus": {
      outline: "none",
    },
  },
  header: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  closeButton: {
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  title: {
    fontWeight: 700,
    fontSize: "1.5rem",
  },
  tagChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    height: "32px",
    borderRadius: "8px",
  },
  content: {
    padding: theme.spacing(3),
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  searchField: {
    flex: 1,
    maxWidth: "400px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: theme.palette.background.default,
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
    },
  },
  filterButton: {
    backgroundColor: theme.palette.background.default,
    borderRadius: "12px",
    padding: "8px 16px",
    textTransform: "none",
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableContainer: {
    borderRadius: "8px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&::-webkit-scrollbar": {
      height: "8px",
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: theme.palette.action.hover,
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.text.disabled,
      borderRadius: "4px",
    },
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: theme.palette.background.default,
    "& th": {
      fontWeight: 600,
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
      padding: "16px",
    },
  },
  tableRow: {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: {
    padding: "16px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  avatar: {
    backgroundColor: "#25d366",
    color: "#fff",
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "1rem",
  },
  contactName: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
  },
  contactId: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  phoneCell: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  actionCell: {
    width: "120px",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.lighter,
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(6),
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "4rem",
    color: theme.palette.action.disabledBackground,
    marginBottom: theme.spacing(2),
  },
  emptyText: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  loading: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  progressBar: {
    height: "6px",
    borderRadius: "3px",
    "& .MuiLinearProgress-bar": {
      borderRadius: "3px",
    },
  },
  countBadge: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: "12px",
    padding: "4px 8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: theme.spacing(1),
  },
}));

const handleRemoveContactTag = async (contactId, tagId) => {
  try {
    await api.delete(`/tags-contacts/${tagId}/${contactId}`);
    // Add success notification here
  } catch (error) {
    console.error("Erro ao remover tag de contato:", error);
    // Add error notification here
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContactTagListModal = ({ open, onClose, tag }) => {
  const classes = useStyles();
  const [tagList, setTagList] = useState(tag?.contacts || []);
  const [filteredList, setFilteredList] = useState(tag?.contacts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, socket } = useContext(AuthContext);

  useEffect(() => {
    if (open && tag) {
      setLoading(true);
      // Simulate loading (replace with actual data fetching)
      const timer = setTimeout(() => {
        const contacts = tag.contacts || [];
        setTagList(contacts);
        setFilteredList(contacts);
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [open, tag]);

  useEffect(() => {
    const onCompanyTags = (data) => {
      if (data.action === "update" || data.action === "create") {
        if (data.tag.id === tag.id && data.tag?.contacts?.length > 0) {
          setTagList(data.tag.contacts);
          setFilteredList(data.tag.contacts);
        }
        if (data.tag.id === tag.id && data.tag?.contacts?.length === 0) {
          setTagList([]);
          setFilteredList([]);
        }
      }
    };
    
    if (socket) {
      socket.on(`company${user.companyId}-tag`, onCompanyTags);
    }

    return () => {
      if (socket) {
        socket.off(`company${user.companyId}-tag`, onCompanyTags);
      }
    };
  }, [tag?.id, user.companyId, socket]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredList(tagList);
    } else {
      const filtered = tagList.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        contact.number?.includes(searchTerm)
      );
      setFilteredList(filtered);
    }
  }, [searchTerm, tagList]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Transition in={open} timeout={300}>
        <div className={classes.paper}>
          <div className={classes.header}>
            <div className={classes.headerContent}>
              <Avatar className={classes.avatar}>
                <LabelIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" className={classes.title}>
                Contatos na Tag
                <Chip
                  icon={<LabelIcon style={{ fontSize: "16px" }} />}
                  label={tag?.name}
                  className={classes.tagChip}
                  size="small"
                />
                {filteredList.length > 0 && (
                  <span className={classes.countBadge}>
                    {filteredList.length} {filteredList.length === 1 ? "contato" : "contatos"}
                  </span>
                )}
              </Typography>
            </div>
            <IconButton 
              className={classes.closeButton}
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className={classes.content}>
            <Box className={classes.controls}>
              <TextField
                className={classes.searchField}
                variant="outlined"
                placeholder="Localizar contato"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

            </Box>

            {loading ? (
              <div className={classes.loading}>
                <LinearProgress className={classes.progressBar} />
              </div>
            ) : filteredList.length > 0 ? (
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="Tabela de contatos" stickyHeader>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell>Contato</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell className={classes.actionCell}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredList.map((contact) => (
                      <TableRow key={contact.id} className={classes.tableRow} hover>
                        <TableCell className={classes.tableCell}>
                          <div className={classes.contactName}>
                            <Avatar className={classes.avatar}>
                              {contact.name?.charAt(0) || <PersonIcon fontSize="small" />}
                            </Avatar>
                            <div className={classes.contactInfo}>
                              <Typography variant="body1" style={{ fontWeight: 500 }}>
                                {contact.name || "Contato sem nome"}
                              </Typography>
                              <Typography variant="caption" className={classes.contactId}>
                                ID: {contact.id}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <div className={classes.phoneCell}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body1">
                              {contact.number || "N/A"}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className={classes.tableCell} align="center">
                          <Tooltip title="Remover da seta de tag">
                            <IconButton
                             style={{
                             backgroundColor: "#FF6B6B", // Vermelho claro
                             padding: "8px",
                             borderRadius: "10px",
                             }}
                              onClick={() => handleRemoveContactTag(contact.id, tag.id)}
                              size="small"
                            >
                              <DeleteIcon style={{ color: "#fff" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className={classes.emptyState}>
                <PersonIcon className={classes.emptyIcon} />
                <Typography variant="h6" className={classes.emptyText}>
                  {searchTerm ? "Nenhum contato correspondente encontrado" : "Nenhum contato nesta tag"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchTerm 
                    ? "Tente ajustar seus critérios de pesquisa" 
                    : "Adicione contatos a esta tag para vê-los listados aqui"}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </Modal>
  );
};

export default ContactTagListModal;