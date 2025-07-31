import React, { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";

import { AuthContext } from "../../context/Auth/AuthContext";
import { ReportProblem, VisibilityOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { yellow, green, blue, orange, red } from "@mui/material/colors";
import { 
  Avatar, 
  CardHeader, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Paper, 
  Typography, 
  makeStyles, 
  Badge, 
  Grid, 
  Tooltip,
  Box,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Modal,
  Backdrop,
  Fade
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { format, isSameDay, parseISO } from "date-fns";
import { getBackendUrl } from "../../config";
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const backendUrl = getBackendUrl();

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6bff',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h5: {
      fontWeight: 600,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    width: '100%',
  },
  userCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '0px',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: theme.spacing(0.5, 1.5),
    minHeight: 48,
  },
  cardHeaderPending: {
    backgroundColor: '#ff758c',
    color: 'white',
    padding: theme.spacing(0.5, 1.5),
    minHeight: 48,
  },
  cardHeaderRoot: {
    padding: 0,
  },
  cardHeaderContent: {
    overflow: 'hidden',
    padding: 0,
  },
  cardHeaderAction: {
    margin: 0,
    alignSelf: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    border: '0px',
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.8125rem',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ticketCount: {
    fontSize: '0.6875rem',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ticketList: {
    padding: 0,
    maxHeight: 400,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  ticketItem: {
    padding: theme.spacing(1, 1.5),
    '&:hover': {
      backgroundColor: 'rgba(74, 107, 255, 0.05)',
    },
  },
  contactName: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 180,
    fontSize: '0.8125rem',
  },
  lastMessage: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 200,
    fontSize: '0.75rem',
  },
  timeStamp: {
    fontSize: '0.6875rem',
    color: theme.palette.text.secondary,
    textAlign: 'right',
  },
  timeStampUnread: {
    fontSize: '0.6875rem',
    color: green[600],
    fontWeight: 600,
    textAlign: 'right',
  },
  tagsContainer: {
    display: 'flex',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  whatsappTag: {
    backgroundColor: '#25D366',
    color: 'white',
    fontSize: '0.6rem',
    height: 18,
  },
  queueTag: {
    fontSize: '0.6rem',
    height: 18,
  },
  pendingIcon: {
    color: yellow[600],
    marginLeft: theme.spacing(0.5),
    fontSize: '1rem',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing(1),
  },
  viewButton: {
    color: theme.palette.primary.main,
    fontSize: '0.65rem',
    padding: '2px 6px',
    minWidth: 0,
    marginLeft: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: '100%',
    border: '0px',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  statItem: {
    flex: 1,
    minWidth: 100,
    textAlign: 'center',
    padding: theme.spacing(1.5),
    borderRadius: 8,
    backgroundColor: '#f6f7f9',
    border: '0px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    margin: theme.spacing(0.5, 0),
  },
  statLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dialogPaper: {
    borderRadius: 8,
    maxWidth: 600,
    width: '100%',
    overflow: 'hidden',
    border: '0px',
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  dialogAvatar: {
    width: 36,
    height: 36,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  dialogSection: {
    marginBottom: theme.spacing(2),
  },
  dialogLabel: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
    display: 'block',
    fontSize: '0.8125rem',
  },
  dialogValue: {
    color: theme.palette.text.primary,
    lineHeight: 1.5,
    fontSize: '0.875rem',
  },
  dialogTags: {
    display: 'flex',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  dialogMessageContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    border: '0px',
  },
  imageModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  enlargedImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardManage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user, socket } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const companyId = user.companyId;

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds] = useState(userQueueIds || []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/usersMoments");
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response?.status !== 500) {
          toastError(err);
        } else {
          toast.error(`${i18n.t("frontEndErrors.getUsers")}`);
        }
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const onAppMessage = (data) => {
      if (data.action === "create" || data.action === "update" || data.action === "delete") {
        fetchTickets();
      }
    };

    socket.on(`company-${companyId}-ticket`, onAppMessage);
    socket.on(`company-${companyId}-appMessage`, onAppMessage);

    return () => {
      socket.off(`company-${companyId}-ticket`, onAppMessage);
      socket.off(`company-${companyId}-appMessage`, onAppMessage);
    };
  }, [socket, companyId]);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/usersMoments");
      setTickets(data);
      setUpdate(!update);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handleOpenImageModal = () => {
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const getAssignedTicketsCount = () => {
    return tickets.filter(ticket => ticket.user).length;
  };

  const getPendingTicketsCount = () => {
    return tickets.filter(ticket => !ticket.user).length;
  };

  const getTotalTicketsCount = () => {
    return tickets.length;
  };

  const getUserWithMostTickets = () => {
    if (!tickets.length) return null;
    
    const userCounts = tickets.reduce((acc, ticket) => {
      if (ticket.user) {
        acc[ticket.user.id] = (acc[ticket.user.id] || 0) + 1;
      }
      return acc;
    }, {});

    const maxUserId = Object.keys(userCounts).reduce((a, b) => 
      userCounts[a] > userCounts[b] ? a : b
    );

    return tickets.find(t => t.user?.id === maxUserId)?.user;
  };

  const translateStatus = (status) => {
    switch(status) {
      case 'pending':
        return 'Pendente';
      case 'open':
        return 'Atendimento';
      default:
        return status || 'Não definido';
    }
  };

  const TicketDialog = ({ ticket, open, onClose }) => {
    if (!ticket) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        classes={{ paper: classes.dialogPaper }}
        fullWidth
      >
        <div className={classes.dialogHeader}>
          <div className={classes.dialogTitle}>
            <Avatar 
              alt={ticket.contact.name} 
              src={ticket.contact.urlPicture} 
              className={classes.dialogAvatar}
              onClick={handleOpenImageModal}
            />
            <Typography variant="h6">{ticket.contact.name}</Typography>
          </div>
        </div>

        <DialogContent className={classes.dialogContent}>
          <div className={classes.dialogSection}>
            <Typography variant="subtitle2" className={classes.dialogLabel}>
              Informações do Ticket
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.dialogLabel}>
                  Status
                </Typography>
                <Typography variant="body1" className={classes.dialogValue}>
                  {translateStatus(ticket.status)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.dialogLabel}>
                  Atualizado em
                </Typography>
                <Typography variant="body1" className={classes.dialogValue}>
                  {format(parseISO(ticket.updatedAt), "dd/MM/yyyy HH:mm")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.dialogLabel}>
                  Atendente
                </Typography>
                <Typography variant="body1" className={classes.dialogValue}>
                  {ticket.user?.name || 'Não atribuído'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" className={classes.dialogLabel}>
                  Canal
                </Typography>
                <Typography variant="body1" className={classes.dialogValue}>
                  {ticket.whatsapp?.name || 'WhatsApp'}
                </Typography>
              </Grid>
            </Grid>

            <div className={classes.dialogTags}>
              <Chip 
                label={ticket.whatsapp?.name || "WhatsApp"} 
                size="small" 
                className={classes.whatsappTag}
              />
              <Chip 
                label={ticket.queue?.name.toUpperCase() || "SEM FILA"} 
                size="small" 
                className={classes.queueTag}
                style={{ backgroundColor: ticket.queue?.color || grey[500] }}
              />
            </div>
          </div>

          <div className={classes.dialogSection}>
            <Typography variant="subtitle2" className={classes.dialogLabel}>
              Última Mensagem
            </Typography>
            <div className={classes.dialogMessageContent}>
              <Typography variant="body1">
                {ticket.lastMessage || 'Nenhuma mensagem registrada'}
              </Typography>
            </div>
          </div>

          {ticket.unreadMessages > 0 && (
            <div className={classes.dialogSection}>
              <Typography variant="subtitle2" className={classes.dialogLabel}>
                Mensagens não lidas
              </Typography>
              <Typography variant="body1" className={classes.dialogValue}>
                {ticket.unreadMessages} mensagem(s) não lida(s)
              </Typography>
            </div>
          )}
        </DialogContent>

        <DialogActions style={{ padding: theme.spacing(1.5, 2) }}>
          <Button 
            onClick={onClose} 
            style={{
            color: "white",
            backgroundColor: "#db6565",
            boxShadow: "none",
            borderRadius: "5px",
            fontSize: "12px",
            }}
            variant="contained"
            size="small"

          >
            Fechar
          </Button>
          <Button 
            onClick={() => {
              onClose();
              history.push(`/tickets/${ticket.uuid}`);
            }} 
          style={{
          color: "white",
          backgroundColor: "#437db5",
          boxShadow: "none",
          borderRadius: "5px",
          fontSize: "12px",
          }}
           variant="contained"
           size="small"
          >
            Abrir Ticket
          </Button>
        </DialogActions>

        {/* Modal para imagem ampliada */}
        <Modal
          open={openImageModal}
          onClose={handleCloseImageModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          className={classes.imageModal}
        >
          <Fade in={openImageModal}>
            <img 
              src={ticket.contact.urlPicture} 
              alt={ticket.contact.name} 
              className={classes.enlargedImage}
              onClick={handleCloseImageModal}
            />
          </Fade>
        </Modal>
      </Dialog>
    );
  };

  const Moments = useMemo(() => {
    if (loading) {
      return (
        <Box className={classes.emptyState}>
          <Typography variant="body1">Carregando tickets...</Typography>
          <LinearProgress color="primary" className={classes.progressBar} />
        </Box>
      );
    }

    if (tickets && tickets.length > 0) {
      const ticketsByUser = tickets.reduce((userTickets, ticket) => {
        const user = ticket.user;

        if (user) {
          const userIndex = userTickets.findIndex((group) => group.user.id === user.id);
          if (userIndex === -1) {
            userTickets.push({
              user,
              userTickets: [ticket],
            });
          } else {
            userTickets[userIndex].userTickets.push(ticket);
          }
        }
        return userTickets;
      }, []);

      return ticketsByUser.map((group, index) => (
        <Paper key={index} className={classes.userCard}>
          <div className={classes.cardHeader}>
            <CardHeader
              avatar={
                <Avatar 
                  alt={group.user.name} 
                  src={group.user.profileImage ? `${backendUrl}/public/company${companyId}/user/${group.user.profileImage}` : null}
                  className={classes.avatar}
                />
              }
              title={
                <Typography className={classes.userName}>
                  {group.user.name}
                </Typography>
              }
              subheader={
                <Typography className={classes.ticketCount}>
                  {`${group.userTickets.length} atendimentos`}
                </Typography>
              }
              action={
                <Button 
                  variant="outlined" 
                  size="small" 
                  className={classes.viewButton}
                  onClick={() => history.push(`/tickets?userId=${group.user.id}`)}
                >
                  Ver todos
                </Button>
              }
              classes={{
                root: classes.cardHeaderRoot,
                content: classes.cardHeaderContent,
                action: classes.cardHeaderAction,
              }}
              style={{ padding: 0 }}
            />
          </div>
          <List className={classes.ticketList}>
            {group.userTickets.map((ticket) => (
              <Fragment key={ticket.id}>
                <ListItem 
                  className={classes.ticketItem} 
                  button
                  onClick={() => handleOpenDialog(ticket)}
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={ticket.contact.name} 
                      src={ticket.contact.urlPicture} 
                      style={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography className={classes.contactName}>
                        {ticket.contact.name}
                      </Typography>
                    }
                    secondary={
                      <Fragment>
                        <Typography className={classes.lastMessage}>
                          {ticket.lastMessage?.length > 30 
                            ? `${ticket.lastMessage.substring(0, 27)}...` 
                            : ticket.lastMessage}
                        </Typography>
                        <div className={classes.tagsContainer}>
                          <Chip 
                            label={ticket.whatsapp?.name || "WhatsApp"} 
                            size="small" 
                            className={classes.whatsappTag}
                          />
                          <Chip 
                            label={ticket.queue?.name.toUpperCase() || "SEM FILA"} 
                            size="small" 
                            className={classes.queueTag}
                            style={{ backgroundColor: ticket.queue?.color || grey[500] }}
                          />
                        </div>
                      </Fragment>
                    }
                  />
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Typography
                      className={Number(ticket.unreadMessages) > 0 
                        ? classes.timeStampUnread 
                        : classes.timeStamp}
                    >
                      {isSameDay(parseISO(ticket.updatedAt), new Date()) 
                        ? format(parseISO(ticket.updatedAt), "HH:mm")
                        : format(parseISO(ticket.updatedAt), "dd/MM")}
                    </Typography>
                    {(user.profile === "admin" || ticket.userId === user.id) && (
                      <Tooltip title="Acessar Ticket">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            history.push(`/tickets/${ticket.uuid}`);
                          }}
                          style={{ padding: 4 }}
                        >
                          <VisibilityOutlined fontSize="small" color="action" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </Fragment>
            ))}
          </List>
        </Paper>
      ));
    } else {
      return (
        <Box className={classes.emptyState}>
          <Typography variant="body1">Nenhum ticket encontrado</Typography>
        </Box>
      );
    }
  }, [update, loading]);

  const MomentsPending = useMemo(() => {
    if (loading) return null;

    if (tickets && tickets.length > 0) {
      const pendingTickets = tickets.filter((ticket) => !ticket.user);

      if (pendingTickets.length === 0) return null;

      return (
        <Paper className={classes.userCard}>
          <div className={classes.cardHeaderPending}>
            <CardHeader
              avatar={
                <Avatar className={classes.avatar}>
                  <ReportProblem fontSize="small" />
                </Avatar>
              }
              title={
                <Typography className={classes.userName}>
                  Tickets Pendentes
                  <ReportProblem className={classes.pendingIcon} fontSize="small" />
                </Typography>
              }
              subheader={
                <Typography className={classes.ticketCount}>
                  {`${pendingTickets.length} atendimentos sem responsável`}
                </Typography>
              }
              action={
                <Button 
                  variant="outlined" 
                  size="small" 
                  className={classes.viewButton}
                  onClick={() => history.push('/tickets?status=pending')}
                >
                  Ver todos
                </Button>
              }
              classes={{
                root: classes.cardHeaderRoot,
                content: classes.cardHeaderContent,
                action: classes.cardHeaderAction,
              }}
              style={{ padding: 0 }}
            />
          </div>
          <List className={classes.ticketList}>
            {pendingTickets.map((ticket) => (
              <Fragment key={ticket.id}>
                <ListItem 
                  className={classes.ticketItem} 
                  button
                  onClick={() => handleOpenDialog(ticket)}
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={ticket.contact.name} 
                      src={ticket.contact.urlPicture} 
                      style={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography className={classes.contactName}>
                        {ticket.contact.name}
                      </Typography>
                    }
                    secondary={
                      <Fragment>
                        <Typography className={classes.lastMessage}>
                          {ticket.lastMessage?.length > 30 
                            ? `${ticket.lastMessage.substring(0, 27)}...` 
                            : ticket.lastMessage}
                        </Typography>
                        <div className={classes.tagsContainer}>
                          <Chip 
                            label={ticket.whatsapp?.name || "WhatsApp"} 
                            size="small" 
                            className={classes.whatsappTag}
                          />
                          <Chip 
                            label={ticket.queue?.name.toUpperCase() || "SEM FILA"} 
                            size="small" 
                            className={classes.queueTag}
                            style={{ backgroundColor: ticket.queue?.color || grey[500] }}
                          />
                        </div>
                      </Fragment>
                    }
                  />
                  <Typography
                    className={Number(ticket.unreadMessages) > 0 
                      ? classes.timeStampUnread 
                      : classes.timeStamp}
                  >
                    {isSameDay(parseISO(ticket.updatedAt), new Date()) 
                      ? format(parseISO(ticket.updatedAt), "HH:mm")
                      : format(parseISO(ticket.updatedAt), "dd/MM")}
                  </Typography>
                </ListItem>
                <Divider variant="inset" component="li" />
              </Fragment>
            ))}
          </List>
        </Paper>
      );
    }
    return null;
  }, [update, loading]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {tickets.length > 0 && (
          <Paper className={classes.statsCard}>
            <div className={classes.statsContainer}>
              <div className={classes.statItem}>
                <Typography className={classes.statLabel}>Total</Typography>
                <Typography className={classes.statValue}>{getTotalTicketsCount()}</Typography>
              </div>
              <div className={classes.statItem}>
                <Typography className={classes.statLabel}>Atribuídos</Typography>
                <Typography className={classes.statValue}>{getAssignedTicketsCount()}</Typography>
              </div>
              <div className={classes.statItem}>
                <Typography className={classes.statLabel}>Pendentes</Typography>
                <Typography className={classes.statValue}>{getPendingTicketsCount()}</Typography>
              </div>
              {getUserWithMostTickets() && (
                <div className={classes.statItem}>
                  <Typography className={classes.statLabel}>Maior volume</Typography>
                  <Typography className={classes.statValue}>
                    {getUserWithMostTickets()?.name.split(' ')[0]}
                  </Typography>
                </div>
              )}
            </div>
          </Paper>
        )}

        <div className={classes.dashboardContainer}>
          {MomentsPending}
          {Moments}
        </div>

        <TicketDialog 
          ticket={selectedTicket} 
          open={openDialog} 
          onClose={handleCloseDialog} 
        />
      </div>
    </ThemeProvider>
  );
};

export default DashboardManage;