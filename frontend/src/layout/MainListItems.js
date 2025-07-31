import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useHelps from "../hooks/useHelps";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

// Ícones modernos
import DashboardIcon from "@mui/icons-material/Dashboard";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CodeIcon from "@mui/icons-material/Code";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ForumIcon from "@mui/icons-material/Forum";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import BusinessIcon from "@mui/icons-material/Business";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import CampaignIcon from "@mui/icons-material/Campaign";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";
import WebhookIcon from "@mui/icons-material/Webhook";
import WorkIcon from "@mui/icons-material/Work";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BuildIcon from "@mui/icons-material/Build";

import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { useActiveMenu } from "../context/ActiveMenuContext";
import { Can } from "../components/Can";
import { isArray } from "lodash";
import api from "../services/api";
import toastError from "../errors/toastError";
import usePlans from "../hooks/usePlans";
import useVersion from "../hooks/useVersion";
import { i18n } from "../translate/i18n";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  listItem: {
    height: "44px",
    width: "auto",
    borderRadius: "4px",
    margin: "4px 8px",
    transition: "background-color 0.3s ease, color 0.3s ease",
    "&:hover": {
      backgroundColor: "#e3e3de",
    },
    "&.active": {
      backgroundColor: theme.palette.action.selected,
      "& .MuiTypography-root": {
        fontWeight: "bold",
        color: theme.palette.primary.main,
      },
    },
  },
  listItemText: {
    fontSize: "14px",
    color: theme.palette.text.primary,
    "&.active": {
      fontWeight: "bold",
      color: theme.palette.primary.main,
    },
  },
  iconHoverActive: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    height: 36,
    width: 36,
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
    transition: "background-color 0.3s ease, color 0.3s ease",
    "&:hover, &.active": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.4rem",
    },
  },
  submenu: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px",
    margin: "4px 8px",
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    fontWeight: "bold",
    padding: theme.spacing(1, 2),
  },
  activeSubmenuHeader: {
    backgroundColor: theme.palette.action.selected,
    "& .MuiTypography-root": {
      fontWeight: "bold",
      color: theme.palette.primary.main,
    },
  },
}));

function ListItemLink(props) {
  const { icon, primary, to, tooltip, showBadge } = props;
  const classes = useStyles();
  const { activeMenu } = useActiveMenu();
  const location = useLocation();
  const isActive = activeMenu === to || location.pathname === to;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to]
  );

  const ConditionalTooltip = ({ children, tooltipEnabled }) =>
    tooltipEnabled ? (
      <Tooltip title={primary} placement="right">
        {children}
      </Tooltip>
    ) : (
      children
    );

  return (
    <ConditionalTooltip tooltipEnabled={!!tooltip}>
      <li>
        <ListItem 
          button 
          component={renderLink} 
          className={`${classes.listItem} ${isActive ? "active" : ""}`}
        >
          {icon ? (
            <ListItemIcon>
              {showBadge ? (
                <Badge badgeContent="!" color="error" overlap="circular">
                  <Avatar className={`${classes.iconHoverActive} ${isActive ? "active" : ""}`}>{icon}</Avatar>
                </Badge>
              ) : (
                <Avatar className={`${classes.iconHoverActive} ${isActive ? "active" : ""}`}>{icon}</Avatar>
              )}
            </ListItemIcon>
          ) : null}
          <ListItemText 
            primary={
              <Typography className={`${classes.listItemText} ${isActive ? "active" : ""}`}>
                {primary}
              </Typography>
            } 
          />
        </ListItem>
      </li>
    </ConditionalTooltip>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CHATS":
      return [...state, ...action.payload];
    case "UPDATE_CHATS":
      return state.map((chat) => (chat.id === action.payload.id ? action.payload : chat));
    case "DELETE_CHAT":
      return state.filter((chat) => chat.id !== action.payload);
    case "RESET":
      return [];
    case "CHANGE_CHAT":
      return state.map((chat) => (chat.id === action.payload.chat.id ? action.payload.chat : chat));
    default:
      return state;
  }
};

const MainListItems = ({ collapsed, drawerClose }) => {
  const theme = useTheme();
  const classes = useStyles();
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, socket } = useContext(AuthContext);
  const { setActiveMenu } = useActiveMenu();
  const location = useLocation();

  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openManagementSubmenu, setOpenManagementSubmenu] = useState(false);
  const [openCommunicationSubmenu, setOpenCommunicationSubmenu] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [openFlowSubmenu, setOpenFlowSubmenu] = useState(false);
  const [openAdministrationSubmenu, setOpenAdministrationSubmenu] = useState(false);
  const [openIntegrationSubmenu, setOpenIntegrationSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [planExpired, setPlanExpired] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);
  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const [version, setVersion] = useState(false);
  const [managementHover, setManagementHover] = useState(false);
  const [communicationHover, setCommunicationHover] = useState(false);
  const [campaignHover, setCampaignHover] = useState(false);
  const [flowHover, setFlowHover] = useState(false);
  const [administrationHover, setAdministrationHover] = useState(false);
  const [integrationHover, setIntegrationHover] = useState(false);
  const { list } = useHelps();
  const [hasHelps, setHasHelps] = useState(false);

  useEffect(() => {
    async function checkHelps() {
      const helps = await list();
      setHasHelps(helps.length > 0);
    }
    checkHelps();
  }, []);

  // Verifica qual submenu deve estar aberto com base na rota atual
  useEffect(() => {
    if (location.pathname === "/" || 
        location.pathname.startsWith("/reports") || 
        location.pathname.startsWith("/moments")) {
      setOpenManagementSubmenu(true);
    }

    if (location.pathname.startsWith("/tickets") ||
        location.pathname.startsWith("/quick-messages") ||
        location.pathname.startsWith("/contacts") ||
        location.pathname.startsWith("/schedules") ||
        location.pathname.startsWith("/tags") ||
        location.pathname.startsWith("/chats")) {
      setOpenCommunicationSubmenu(true);
    }

    if (location.pathname.startsWith("/campaigns") || 
        location.pathname.startsWith("/contact-lists") || 
        location.pathname.startsWith("/campaigns-config")) {
      setOpenCampaignSubmenu(true);
    }

    if (location.pathname.startsWith("/phrase-lists") || 
        location.pathname.startsWith("/flowbuilders")) {
      setOpenFlowSubmenu(true);
    }

    if (location.pathname.startsWith("/users") ||
        location.pathname.startsWith("/queues") ||
        location.pathname.startsWith("/prompts") ||
        location.pathname.startsWith("/queue-integration") ||
        location.pathname.startsWith("/connections") ||
        location.pathname.startsWith("/allConnections") ||
        location.pathname.startsWith("/files") ||
        location.pathname.startsWith("/financeiro") ||
        location.pathname.startsWith("/settings") ||
        location.pathname.startsWith("/companies")) {
      setOpenAdministrationSubmenu(true);
    }

    if (location.pathname.startsWith("/messages-api") ||
        location.pathname.startsWith("/kanban")) {
      setOpenIntegrationSubmenu(true);
    }
  }, [location.pathname]);

  const isManagementActive =
    location.pathname === "/" || 
    location.pathname.startsWith("/reports") || 
    location.pathname.startsWith("/moments");

  const isCommunicationActive =
    location.pathname.startsWith("/tickets") ||
    location.pathname.startsWith("/quick-messages") ||
    location.pathname.startsWith("/contacts") ||
    location.pathname.startsWith("/schedules") ||
    location.pathname.startsWith("/tags") ||
    location.pathname.startsWith("/chats");

  const isCampaignRouteActive =
    location.pathname === "/campaigns" ||
    location.pathname.startsWith("/contact-lists") ||
    location.pathname.startsWith("/campaigns-config");

  const isFlowbuilderRouteActive =
    location.pathname.startsWith("/phrase-lists") || 
    location.pathname.startsWith("/flowbuilders");

  const isAdministrationActive =
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/queues") ||
    location.pathname.startsWith("/prompts") ||
    location.pathname.startsWith("/queue-integration") ||
    location.pathname.startsWith("/connections") ||
    location.pathname.startsWith("/allConnections") ||
    location.pathname.startsWith("/files") ||
    location.pathname.startsWith("/financeiro") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/companies");

  const isIntegrationActive =
    location.pathname.startsWith("/messages-api") ||
    location.pathname.startsWith("/kanban");

  useEffect(() => {
    if (location.pathname.startsWith("/tickets")) {
      setActiveMenu("/tickets");
    } else {
      setActiveMenu("");
    }
  }, [location, setActiveMenu]);

  const { getPlanCompany } = usePlans();
  const { getVersion } = useVersion();

  useEffect(() => {
    async function fetchVersion() {
      const _version = await getVersion();
      setVersion(_version.version);
    }
    fetchVersion();
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
      setPlanExpired(moment(moment().format()).isBefore(user.company.dueDate));
    }
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    if (user.id) {
      const companyId = user.companyId;
      const onCompanyChatMainListItems = (data) => {
        if (data.action === "new-message") {
          dispatch({ type: "CHANGE_CHAT", payload: data });
        }
        if (data.action === "update") {
          dispatch({ type: "CHANGE_CHAT", payload: data });
        }
      };

      socket.on(`company-${companyId}-chat`, onCompanyChatMainListItems);
      return () => {
        socket.off(`company-${companyId}-chat`, onCompanyChatMainListItems);
      };
    }
  }, [socket]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div onClick={drawerClose}>
      {/* Seção de Gerenciamento */}
      {planExpired && (
        <Can
          role={
            (user.profile === "user" && user.showDashboard === "enabled") || user.allowRealTime === "enabled"
              ? "admin"
              : user.profile
          }
          perform={"drawer-admin-items:view"}
          yes={() => (
            <>
              <Tooltip title={collapsed ? i18n.t("mainDrawer.listItems.management") : ""} placement="right">
                <ListItem
                  dense
                  button
                  onClick={() => setOpenManagementSubmenu((prev) => !prev)}
                  onMouseEnter={() => setManagementHover(true)}
                  onMouseLeave={() => setManagementHover(false)}
                  className={isManagementActive ? classes.activeSubmenuHeader : ""}
                >
                  <ListItemIcon>
                    <Avatar
                      className={`${classes.iconHoverActive} ${isManagementActive || managementHover ? "active" : ""}`}
                    >
                      <DashboardIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography className={`${classes.listItemText} ${isManagementActive ? "active" : ""}`}>
                        {i18n.t("mainDrawer.listItems.management")}
                      </Typography>
                    }
                  />
                  {openManagementSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
              </Tooltip>
              <Collapse in={openManagementSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
                <Can
                  role={user.profile === "user" && user.showDashboard === "enabled" ? "admin" : user.profile}
                  perform={"drawer-admin-items:view"}
                  yes={() => (
                    <>
                      <ListItemLink
                        small
                        to="/"
                        primary="Dashboard"
                        icon={<DashboardIcon />}
                        tooltip={collapsed}
                      />
                      <ListItemLink
                        small
                        to="/reports"
                        primary={i18n.t("mainDrawer.listItems.reports")}
                        icon={<ListAltIcon />}
                        tooltip={collapsed}
                      />
                    </>
                  )}
                />
                <Can
                  role={user.profile === "user" && user.allowRealTime === "enabled" ? "admin" : user.profile}
                  perform={"drawer-admin-items:view"}
                  yes={() => (
                    <ListItemLink
                      to="/moments"
                      primary={i18n.t("mainDrawer.listItems.chatsTempoReal")}
                      icon={<ForumIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              </Collapse>
            </>
          )}
        />
      )}

      {/* Seção de Comunicação */}
      <Tooltip title={collapsed ? i18n.t("Comunicação") : ""} placement="right">
        <ListItem
          dense
          button
          onClick={() => setOpenCommunicationSubmenu((prev) => !prev)}
          onMouseEnter={() => setCommunicationHover(true)}
          onMouseLeave={() => setCommunicationHover(false)}
          className={isCommunicationActive ? classes.activeSubmenuHeader : ""}
        >
          <ListItemIcon>
            <Avatar
              className={`${classes.iconHoverActive} ${isCommunicationActive || communicationHover ? "active" : ""}`}
            >
              <ChatBubbleIcon />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography className={`${classes.listItemText} ${isCommunicationActive ? "active" : ""}`}>
                Comunicação
              </Typography>
            }
          />
          {openCommunicationSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
      </Tooltip>
      <Collapse in={openCommunicationSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
        {planExpired && (
          <ListItemLink
            to="/tickets"
            primary={i18n.t("mainDrawer.listItems.tickets")}
            icon={<WhatsAppIcon />}
            tooltip={collapsed}
          />
        )}

        {planExpired && (
          <ListItemLink
            to="/quick-messages"
            primary={i18n.t("mainDrawer.listItems.quickMessages")}
            icon={<FlashOnIcon />}
            tooltip={collapsed}
          />
        )}

        {planExpired && (
          <ListItemLink
            to="/contacts"
            primary={i18n.t("mainDrawer.listItems.contacts")}
            icon={<ContactPhoneIcon />}
            tooltip={collapsed}
          />
        )}

        {showSchedules && planExpired && (
          <ListItemLink
            to="/schedules"
            primary={i18n.t("mainDrawer.listItems.schedules")}
            icon={<ScheduleIcon />}
            tooltip={collapsed}
          />
        )}

        {planExpired && (
          <ListItemLink
            to="/tags"
            primary={i18n.t("mainDrawer.listItems.tags")}
            icon={<LocalOfferIcon />}
            tooltip={collapsed}
          />
        )}

        {showInternalChat && planExpired && (
          <ListItemLink
            to="/chats"
            primary={i18n.t("mainDrawer.listItems.chats")}
            icon={
              <Badge color="secondary" variant="dot" invisible={invisible}>
                <ForumIcon />
              </Badge>
            }
            tooltip={collapsed}
          />
        )}
      </Collapse>

      {/* Seção de Campanhas */}
      {showCampaigns && planExpired && (
        <Can
          role={user.profile}
          perform="dashboard:view"
          yes={() => (
            <>
              <Tooltip title={collapsed ? i18n.t("mainDrawer.listItems.campaigns") : ""} placement="right">
                <ListItem
                  dense
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                  onMouseEnter={() => setCampaignHover(true)}
                  onMouseLeave={() => setCampaignHover(false)}
                  className={isCampaignRouteActive ? classes.activeSubmenuHeader : ""}
                >
                  <ListItemIcon>
                    <Avatar
                      className={`${classes.iconHoverActive} ${isCampaignRouteActive || campaignHover ? "active" : ""}`}
                    >
                      <CampaignIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography className={`${classes.listItemText} ${isCampaignRouteActive ? "active" : ""}`}>
                        {i18n.t("mainDrawer.listItems.campaigns")}
                      </Typography>
                    }
                  />
                  {openCampaignSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
              </Tooltip>
              <Collapse in={openCampaignSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
                <List dense component="div" disablePadding>
                  <ListItemLink
                    to="/campaigns"
                    primary={i18n.t("campaigns.subMenus.list")}
                    icon={<ListAltIcon />}
                    tooltip={collapsed}
                  />
                  <ListItemLink
                    to="/contact-lists"
                    primary={i18n.t("campaigns.subMenus.listContacts")}
                    icon={<PeopleIcon />}
                    tooltip={collapsed}
                  />
                  <ListItemLink
                    to="/campaigns-config"
                    primary={i18n.t("campaigns.subMenus.settings")}
                    icon={<SettingsIcon />}
                    tooltip={collapsed}
                  />
                </List>
              </Collapse>
            </>
          )}
        />
      )}

      {/* Seção de Fluxos */}
      {planExpired && (
        <Can
          role={user.profile}
          perform="dashboard:view"
          yes={() => (
            <>
              <Tooltip title={collapsed ? i18n.t("Flowbuilder") : ""} placement="right">
                <ListItem
                  dense
                  button
                  onClick={() => setOpenFlowSubmenu((prev) => !prev)}
                  onMouseEnter={() => setFlowHover(true)}
                  onMouseLeave={() => setFlowHover(false)}
                  className={isFlowbuilderRouteActive ? classes.activeSubmenuHeader : ""}
                >
                  <ListItemIcon>
                    <Avatar
                      className={`${classes.iconHoverActive} ${isFlowbuilderRouteActive || flowHover ? "active" : ""}`}
                    >
                      <WebhookIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography className={`${classes.listItemText} ${isFlowbuilderRouteActive ? "active" : ""}`}>
                        {i18n.t("Construtor de Fluxo")}
                      </Typography>
                    }
                  />
                  {openFlowSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
              </Tooltip>
              <Collapse in={openFlowSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
                <List dense component="div" disablePadding>
                  <ListItemLink
                    to="/phrase-lists"
                    primary={"Fluxo de Campanha"}
                    icon={<CampaignIcon />}
                    tooltip={collapsed}
                  />
                  <ListItemLink
                    to="/flowbuilders"
                    primary={'Fluxo de conversa'}
                    icon={<ShapeLineIcon />}
                  />
                </List>
              </Collapse>
            </>
          )}
        />
      )}

      {/* Seção de Ferramentas */}
      <Tooltip title={collapsed ? "Ferramentas" : ""} placement="right">
        <ListItem
          dense
          button
          onClick={() => setOpenIntegrationSubmenu((prev) => !prev)}
          onMouseEnter={() => setIntegrationHover(true)}
          onMouseLeave={() => setIntegrationHover(false)}
          className={isIntegrationActive ? classes.activeSubmenuHeader : ""}
        >
          <ListItemIcon>
            <Avatar
              className={`${classes.iconHoverActive} ${isIntegrationActive || integrationHover ? "active" : ""}`}
            >
              <BuildIcon />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography className={`${classes.listItemText} ${isIntegrationActive ? "active" : ""}`}>
                Ferramentas
              </Typography>
            }
          />
          {openIntegrationSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
      </Tooltip>
      <Collapse in={openIntegrationSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
        {showKanban && planExpired && (
          <ListItemLink
            to="/kanban"
            primary={i18n.t("mainDrawer.listItems.kanban")}
            icon={<ViewKanbanIcon />}
            tooltip={collapsed}
          />
        )}

        <ListItemLink
          to="/todolist"
          primary={i18n.t("Tarefas")}
          icon={<EventAvailableIcon />}
        />

        <ListItemLink
          to="/helps"
          primary={i18n.t("mainDrawer.listItems.helps")}
          icon={<HelpOutlineIcon />}
          tooltip={collapsed}
        />

        <ListItemLink
          to="/documentacao"
          primary={i18n.t("Documentação")}
          icon={<CodeIcon />}
          tooltip={collapsed}
        />
      </Collapse>

      {/* Seção de Administração */}
      <Can
        role={user.profile === "user" && user.allowConnections === "enabled" ? "admin" : user.profile}
        perform="dashboard:view"
        yes={() => (
          <>
            
            <Tooltip title={collapsed ? "Administração" : ""} placement="right">
              <ListItem
                dense
                button
                onClick={() => setOpenAdministrationSubmenu((prev) => !prev)}
                onMouseEnter={() => setAdministrationHover(true)}
                onMouseLeave={() => setAdministrationHover(false)}
                className={isAdministrationActive ? classes.activeSubmenuHeader : ""}
              >
                <ListItemIcon>
                  <Avatar
                    className={`${classes.iconHoverActive} ${isAdministrationActive || administrationHover ? "active" : ""}`}
                  >
                    <SettingsIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography className={`${classes.listItemText} ${isAdministrationActive ? "active" : ""}`}>
                      Administração
                    </Typography>
                  }
                />
                {openAdministrationSubmenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
            </Tooltip>
            <Collapse in={openAdministrationSubmenu} timeout="auto" unmountOnExit className={classes.submenu}>
              {user.super && (
                <ListItemLink
                  to="/announcements"
                  primary={i18n.t("mainDrawer.listItems.annoucements")}
                  icon={<AnnouncementIcon />}
                  tooltip={collapsed}
                />
              )}

              {showExternalApi && planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/messages-api"
                      primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                      icon={<CodeIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/users"
                      primary={i18n.t("mainDrawer.listItems.users")}
                      icon={<PeopleIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/queues"
                      primary={i18n.t("mainDrawer.listItems.queues")}
                      icon={<AccountTreeIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {showOpenAi && planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/prompts"
                      primary={i18n.t("mainDrawer.listItems.prompts")}
                      icon={<AllInclusiveIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {showIntegrations && planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/queue-integration"
                      primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                      icon={<DeviceHubIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {planExpired && (
                <Can
                  role={user.profile === "user" && user.allowConnections === "enabled" ? "admin" : user.profile}
                  perform={"drawer-admin-items:view"}
                  yes={() => (
                    <ListItemLink
                      to="/connections"
                      primary={i18n.t("mainDrawer.listItems.connections")}
                      icon={<SyncAltIcon />}
                      showBadge={connectionWarning}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {user.super && (
                <ListItemLink
                  to="/allConnections"
                  primary={i18n.t("mainDrawer.listItems.allConnections")}
                  icon={<SyncAltIcon />}
                  tooltip={collapsed}
                />
              )}

              {planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/files"
                      primary={i18n.t("mainDrawer.listItems.files")}
                      icon={<AttachFileIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              <Can
                role={user.profile}
                perform="dashboard:view"
                yes={() => (
                  <ListItemLink
                    to="/financeiro"
                    primary={i18n.t("mainDrawer.listItems.financeiro")}
                    icon={<LocalAtmIcon />}
                    tooltip={collapsed}
                  />
                )}
              />

              {planExpired && (
                <Can
                  role={user.profile}
                  perform="dashboard:view"
                  yes={() => (
                    <ListItemLink
                      to="/settings"
                      primary={i18n.t("mainDrawer.listItems.settings")}
                      icon={<SettingsIcon />}
                      tooltip={collapsed}
                    />
                  )}
                />
              )}

              {user.super && (
                <ListItemLink
                  to="/companies"
                  primary={i18n.t("mainDrawer.listItems.companies")}
                  icon={<BusinessIcon />}
                  tooltip={collapsed}
                />
              )}
            </Collapse>
          </>
        )}
      />

      {!collapsed && (
        <React.Fragment>
          <Divider />
          <Typography
            style={{
              fontSize: "12px",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
           
          </Typography>
        </React.Fragment>
      )}
    </div>
  );
};

export default MainListItems;