import React, { useState, useEffect, useRef, useContext, useCallback } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { green, grey } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { List, Tooltip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import toastError from "../../errors/toastError";
import { v4 as uuidv4 } from "uuid";

import GroupIcon from '@material-ui/icons/Group';
import ContactTag from "../ContactTag";
import ConnectionIcon from "../ConnectionIcon";
import AcceptTicketWithouSelectQueue from "../AcceptTicketWithoutQueueModal";
import TransferTicketModalCustom from "../TransferTicketModalCustom";
import ShowTicketOpen from "../ShowTicketOpenModal";
import { isNil } from "lodash";
import { toast } from "react-toastify";
import { Done, HighlightOff, Replay, SwapHoriz, MarkunreadMailboxTwoTone, Markunread } from "@material-ui/icons";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import { Avatar, Badge, ListItemAvatar, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    ticket: {
        position: "relative"
    },

    pendingTicket: {
        cursor: "unset",
    },
    queueTag: {
        background: "#FCFCFC",
        color: "#000",
        marginRight: 1,
        padding: 1,
        fontWeight: 'bold',
        // paddingLeft: 5,
        // paddingRight: 5,
        borderRadius: 3,
        fontSize: "0.5em",
        whiteSpace: "nowrap"
    },
    noTicketsDiv: {
        display: "flex",
        height: "100px",
        margin: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    newMessagesCount: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: 0,
        color: "green",
        fontWeight: "bold",
        marginRight: "10px",
        borderRadius: 0,
    },
    noTicketsText: {
        textAlign: "center",
        color: "rgb(104, 121, 146)",
        fontSize: "14px",
        lineHeight: "1.4",
    },
    connectionTag: {
        background: "green",
        color: "#FFF",
        marginRight: 1,
        padding: 1,
        fontWeight: 'bold',
        // paddingLeft: 5,
        // paddingRight: 5,
        borderRadius: 3,
        fontSize: "0.6em",
        // whiteSpace: "nowrap"
    },
    noTicketsTitle: {
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "600",
        margin: "0px",
    },

    contactNameWrapper: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "5px",
        fontWeight: "bold",
        color: theme.mode === 'light' ? "black" : "white",
    },

    lastMessageTime: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: -30,
        marginRight: "1px",
        color: theme.mode === 'light' ? "black" : grey[400],
    },

    lastMessageTimeUnread: {
        justifySelf: "flex-end",
        textAlign: "right",
        position: "relative",
        top: -30,
        color: "green",
        fontWeight: "bold",
        marginRight: "1px",
    },

    closedBadge: {
        alignSelf: "center",
        justifySelf: "flex-end",
        marginRight: 32,
        marginLeft: "auto",
    },

    contactLastMessage: {
        paddingRight: "0%",
        marginLeft: "5px",
        color: theme.mode === 'light' ? "black" : grey[400],
    },

    contactLastMessageUnread: {
        paddingRight: 20,
        fontWeight: "bold",
        color: theme.mode === 'light' ? "black" : grey[400],
        width: "50%"
    },

    badgeStyle: {
        color: "white",
        backgroundColor: green[500],
    },

    acceptButton: {
        position: "absolute",
        right: "1px",
    },

    ticketQueueColor: {
        flex: "none",
        // width: "8px",
        height: "100%",
        position: "absolute",
        top: "0%",
        left: "0%",
    },

    ticketInfo: {
        position: "relative",
        top: -13
    },
    secondaryContentSecond: {
        display: 'flex',
        // marginBottom: 2,
        // marginLeft: "5px",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        flexDirection: "row",
        alignContent: "flex-start",
        // height: "10px"
    },
    ticketInfo1: {
        position: "relative",
        top: 13,
        right: 0
    },
    Radiusdot: {
        "& .MuiBadge-badge": {
            borderRadius: 2,
            position: "inherit",
            height: 16,
            margin: 2,
            padding: 3
        },
        "& .MuiBadge-anchorOriginTopRightRectangle": {
            transform: "scale(1) translate(0%, -40%)",
        },
    },
    connectionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const TicketListItemCustom = ({ setTabOpen, ticket }) => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [acceptTicketWithouSelectQueueOpen, setAcceptTicketWithouSelectQueueOpen] = useState(false);
    const [transferTicketModalOpen, setTransferTicketModalOpen] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [userTicketOpen, setUserTicketOpen] = useState("");
    const [queueTicketOpen, setQueueTicketOpen] = useState("");

    const { ticketId } = useParams();
    const isMounted = useRef(true);
    const { setCurrentTicket } = useContext(TicketsContext);
    const { user } = useContext(AuthContext);

    const { get: getSetting } = useCompanySettings();

    useEffect(() => {
        console.log("======== TicketListItemCustom ===========")
        console.log(ticket)
        console.log("=========================================")
    }, [ticket])

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleOpenAcceptTicketWithouSelectQueue = useCallback(() => {
        // console.log(ticket)
        setAcceptTicketWithouSelectQueueOpen(true);
    }, []);

    const handleCloseTicket = async (id) => {
        const setting = await getSetting(
            {
                "column": "requiredTag"
            }
        );

        if (setting.requiredTag === "enabled") {
            //verificar se tem uma tag   
            try {
                const contactTags = await api.get(`/contactTags/${ticket.contact.id}`);
                if (!contactTags.data.tags) {
                    toast.warning(i18n.t("messagesList.header.buttons.requiredTag"))
                } else {
                    await api.put(`/tickets/${id}`, {
                        status: "closed",
                        userId: user?.id || null,
                    });

                    if (isMounted.current) {
                        setLoading(false);
                    }

                    history.push(`/tickets/`);
                }
            } catch (err) {
                setLoading(false);
                toastError(err);
            }
        } else {
            setLoading(true);
            try {
                await api.put(`/tickets/${id}`, {
                    status: "closed",
                    userId: user?.id || null,
                });

            } catch (err) {
                setLoading(false);
                toastError(err);
            }
            if (isMounted.current) {
                setLoading(false);
            }

            history.push(`/tickets/`);
        }

    };

    const handleCloseIgnoreTicket = async (id) => {
        setLoading(true);
        try {
            await api.put(`/tickets/${id}`, {
                status: "closed",
                userId: user?.id || null,
                sendFarewellMessage: false,
                amountUsedBotQueues: 0
            });

        } catch (err) {
            setLoading(false);
            toastError(err);
        }
        if (isMounted.current) {
            setLoading(false);
        }

        history.push(`/tickets/`);
    };

    const truncate = (str, len) => {
        if (!isNil(str)) {
            if (str.length > len) {
                return str.substring(0, len) + "...";
            }
            return str;
        }
    };

    const handleCloseTransferTicketModal = useCallback(() => {
        if (isMounted.current) {
            setTransferTicketModalOpen(false);
        }
    }, []);

    const handleUnreadMessage = async () => {
        setLoading(true)
        const setUnread = await api.put(`/setunredmsg/${ticket.id}`, {
            id: ticket.id
        });
        setLoading(false);
        history.push(`/tickets/`);

        window.location.reload();
        
    }

    const handleOpenTransferModal = () => {
        setLoading(true)
        setTransferTicketModalOpen(true);
        if (isMounted.current) {
            setLoading(false);
        }
        handleSelectTicket(ticket);
        // history.push('/tickets');
        // setTimeout(() => {
        history.push(`/tickets/${ticket.uuid}`);
        // }, 0);
    }

    const handleAcepptTicket = async (id) => {
        setLoading(true);
        try {
            const otherTicket = await api.put(`/tickets/${id}`, ({
                status: ticket.isGroup && ticket.channel === 'whatsapp' ? "group" : "open",
                userId: user?.id,
            }));

            if (otherTicket.data.id !== ticket.id) {
                if (otherTicket.data.userId !== user?.id) {
                    setOpenAlert(true);
                    setUserTicketOpen(otherTicket.data.user.name);
                    setQueueTicketOpen(otherTicket.data.queue.name);
                } else {
                    setLoading(false);
                    setTabOpen(ticket.isGroup ? "group" : "open");
                    handleSelectTicket(otherTicket.data);
                    // history.push('/tickets');
                    // setTimeout(() => {
                    history.push(`/tickets/${otherTicket.uuid}`);
                    // }, 0);
                }
            } else {
                let setting;

                try {
                    setting = await getSetting({
                        "column": "sendGreetingAccepted"
                    });
                } catch (err) {
                    toastError(err);
                }

                if (setting.sendGreetingAccepted === "enabled" && (!ticket.isGroup || ticket.whatsapp?.groupAsTicket === "enabled")) {
                    handleSendMessage(ticket.id);
                }
                if (isMounted.current) {
                    setLoading(false);
                }

                setTabOpen(ticket.isGroup ? "group" : "open");
                handleSelectTicket(ticket);
                // history.push('/tickets');
                // setTimeout(() => {
                history.push(`/tickets/${ticket.uuid}`);
                // }, 0);
            }
        } catch (err) {
            setLoading(false);
            toastError(err);
        }
    };


    const handleSendMessage = async (id) => {

        let setting;

        try {
            setting = await getSetting({
                "column": "greetingAcceptedMessage"
            })
        } catch (err) {
            toastError(err);
        }

        const msg = `${setting.greetingAcceptedMessage}`; //`{{ms}} *{{name}}*, ${i18n.t("mainDrawer.appBar.user.myName")} *${user?.name}* ${i18n.t("mainDrawer.appBar.user.continuity")}.`;
        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: `${msg.trim()}`,
        };
        try {
            await api.post(`/messages/${id}`, message);
        } catch (err) {
            toastError(err);
        }
    };

    const handleCloseAlert = useCallback(() => {
        setOpenAlert(false);
        setLoading(false);
    }, []);

    const handleSelectTicket = (ticket) => {
        const code = uuidv4();
        const { id, uuid } = ticket;
        setCurrentTicket({ id, uuid, code });
    };

    return (
        <React.Fragment key={ticket.id}>
            {openAlert && (
                <ShowTicketOpen
                    isOpen={openAlert}
                    handleClose={handleCloseAlert}
                    user={userTicketOpen}
                    queue={queueTicketOpen}
                />
            )}
            {acceptTicketWithouSelectQueueOpen && (
                <AcceptTicketWithouSelectQueue
                    modalOpen={acceptTicketWithouSelectQueueOpen}
                    onClose={(e) => setAcceptTicketWithouSelectQueueOpen(false)}
                    ticketId={ticket.id}
                    ticket={ticket}
                />
            )}
            {transferTicketModalOpen && (
                <TransferTicketModalCustom
                    modalOpen={transferTicketModalOpen}
                    onClose={handleCloseTransferTicketModal}
                    ticketid={ticket.id}
                    ticket={ticket}
                />
            )}
            {/* <TicketMessagesDialog
                open={openTicketMessageDialog}
                handleClose={() => setOpenTicketMessageDialog(false)}
                ticketId={ticket.id}
            /> */}
            <ListItem
                button
                dense
                onClick={(e) => {
                    console.log('e', e)
                    const isCheckboxClicked = (e.target.tagName.toLowerCase() === 'input' && e.target.type === 'checkbox')
                        || (e.target.tagName.toLowerCase() === 'svg' && e.target.type === undefined)
                        || (e.target.tagName.toLowerCase() === 'path' && e.target.type === undefined);
                    // Se o clique foi no Checkbox, não execute handleSelectTicket

                    if (isCheckboxClicked) return;

                    handleSelectTicket(ticket);
                }}
                selected={ticketId && ticketId === ticket.uuid}
                className={clsx(classes.ticket, {
                    [classes.pendingTicket]: ticket.status === "pending",
                })}
            >
                <ListItemAvatar
                    style={{ marginLeft: "-15px" }}
                >
                    <Avatar
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                        }}
                        src={`${ticket?.contact?.urlPicture}`}

                    />
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={
                        <span className={classes.contactNameWrapper}>
                            <Typography
                                noWrap
                                component="span"
                                variant="body2"
                            // color="textPrimary"
                            >
                                {ticket.isGroup && ticket.channel === "whatsapp" && <GroupIcon fontSize="small" style={{ color: grey[700], marginBottom: '-1px', marginLeft: '5px' }} />} &nbsp;
                                {ticket.channel && <ConnectionIcon width="20" height="20" className={classes.connectionIcon} connectionType={ticket.channel} />} &nbsp;
                                {truncate(ticket.contact?.name, 60)}
                                {/* {profile === "admin"  && ( */}
                                {/* <Tooltip title="Espiar Conversa">
                                        <VisibilityIcon
                                            onClick={() => setOpenTicketMessageDialog(true)}
                                            fontSize="small"
                                            style={{
                                                color: blue[700],
                                                cursor: "pointer",
                                                marginLeft: 10,
                                                verticalAlign: "middle"
                                            }}
                                        />
                                    </Tooltip> */}
                                {/* )} */}
                            </Typography>
                            {/* <ListItemSecondaryAction>
                                <Box className={classes.ticketInfo1}>{renderTicketInfo()}</Box>
                            </ListItemSecondaryAction> */}
                        </span>
                    }
                    secondary={
                        <span className={classes.contactNameWrapper}>

                            <Typography
                                className={Number(ticket.unreadMessages) > 0 ? classes.contactLastMessageUnread : classes.contactLastMessage}
                                noWrap
                                component="span"
                                variant="body2"
                            // color="textSecondary"
                            // style={console.log('ticket.lastMessage', ticket.lastMessage)}
                            >
                                {ticket.lastMessage ? (
                                    <>
                                        {ticket.lastMessage.includes('fb.me') ? (
                        <MarkdownWrapper>Clique de Anúncio</MarkdownWrapper> //Clique de Anúncio adicionado
                      ) : ticket.lastMessage.includes('data:image/png;base64') ?
                                            <MarkdownWrapper>Localização</MarkdownWrapper> :
                                            <> {ticket.lastMessage.includes('BEGIN:VCARD') ?
                                                <MarkdownWrapper>Contato</MarkdownWrapper> :
                                                <MarkdownWrapper>{truncate(ticket.lastMessage, 40)}</MarkdownWrapper>}
                                            </>
                                        }
                                    </>
                                ) : (
                                    <br />
                                )}
                                <span className={classes.secondaryContentSecond} >
                                    {ticket?.whatsapp ? <Badge className={classes.connectionTag} style={{ backgroundColor: ticket.channel === "whatsapp" ? "#25D366" : ticket.channel === "facebook" ? "#4267B2" : "#E1306C" }}>{ticket.whatsapp?.name.toUpperCase()}</Badge> : <br></br>}
                                    {<Badge style={{ backgroundColor: ticket.queue?.color || "#db6565" }} className={classes.connectionTag}>{ticket.queueId ? ticket.queue?.name.toUpperCase() : ticket.status === "lgpd" ? "LGPD" : "SEM FILA"}</Badge>}
                                    {ticket?.user && (<Badge style={{ backgroundColor: "#000000" }} className={classes.connectionTag}>{ticket.user?.name.toUpperCase()}</Badge>)}
                                </span>
                                <span className={classes.secondaryContentSecond} >
                                    {
                                        ticket.tags?.map((tag) => {
                                            return (
                                                <ContactTag tag={tag} key={`ticket-contact-tag-${ticket.id}-${tag.id}`} />
                                            );
                                        })
                                    }
                                </span>
                            </Typography>

                            <Badge
                                className={classes.newMessagesCount}
                                badgeContent={ticket.unreadMessages}
                                classes={{
                                    badge: classes.badgeStyle,
                                }}
                            />
                        </span>
                    }

                />
                <ListItemSecondaryAction>
                    {ticket.lastMessage && (
                        <>

                            <Typography
                                className={Number(ticket.unreadMessages) > 0 ? classes.lastMessageTimeUnread : classes.lastMessageTime}
                                component="span"
                                variant="body2"
                            // color="textSecondary"
                            >

                                {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                                    <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                                ) : (
                                    <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                                )}
                            </Typography>

                            <br />

                        </>
                    )}

                </ListItemSecondaryAction>
<ListItemSecondaryAction>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
    {/* Botão de Aceitar Ticket Sem Fila */}
    {(ticket.status === "pending" && !ticket.queueId) && (
      <Tooltip title="Aceitar ticket sem fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#4ec24e",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={handleOpenAcceptTicketWithouSelectQueue}
        >
          <Done />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Aceitar Ticket Com Fila */}
    {(ticket.status === "pending" && ticket.queueId) && (
      <Tooltip title="Aceitar ticket com fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#ba8d1a",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={() => handleAcepptTicket(ticket.id)}
        >
          <Done />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Transferir */}
    {(["pending", "open", "group"].includes(ticket.status)) && (
      <Tooltip title="Transferir ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#437db5",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={handleOpenTransferModal}
        >
          <SwapHoriz />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Fechar Ticket */}
    {(["open", "group"].includes(ticket.status)) && (
      <Tooltip title="Fechar ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#db6565",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={() => handleCloseTicket(ticket.id)}
        >
          <HighlightOff />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Ignorar Ticket */}
    {(["pending", "lgpd"].includes(ticket.status) && (user.userClosePendingTicket === "enabled" || user.profile === "admin")) && (
      <Tooltip title="Ignorar ticket" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#db6565",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={() => handleCloseIgnoreTicket(ticket.id)}
        >
          <HighlightOff />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Reabrir Ticket (Sem Fila) */}
    {(ticket.status === "closed" && !ticket.queueId) && (
      <Tooltip title="Reabrir ticket sem fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#0872B9",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={handleOpenAcceptTicketWithouSelectQueue}
        >
          <Replay />
        </ButtonWithSpinner>
      </Tooltip>
    )}

    {/* Botão de Reabrir Ticket (Com Fila) */}
    {(ticket.status === "closed" && ticket.queueId) && (
      <Tooltip title="Reabrir ticket com fila" arrow placement="top">
        <ButtonWithSpinner
          variant="contained"
          style={{
            backgroundColor: "#444394",
            color: "#fff",
            padding: "8px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "none",
          }}
          size="small"
          loading={loading}
          onClick={() => handleAcepptTicket(ticket.id)}
        >
          <Replay />
        </ButtonWithSpinner>
      </Tooltip>
    )}
  </div>
</ListItemSecondaryAction>
            </ListItem>
            {/* <Divider variant="inset" component="li" /> */}
        </React.Fragment>
    );
};

export default TicketListItemCustom;