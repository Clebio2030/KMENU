import React, { useContext, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, LinearProgress } from "@mui/material";
import { Groups, SaveAlt } from "@mui/icons-material";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';
import * as XLSX from 'xlsx';
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import TabPanel from "../../components/TabPanel";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";
import { AuthContext } from "../../context/Auth/AuthContext";
import Chart from "react-apexcharts";
import Grid from '@mui/material/Grid';
import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import ChatsUser from "./ChartsUser";
import ChartDonut from "./ChartDonut";
import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { Avatar, Button, Card, CardContent, Container, Stack, SvgIcon, Tab, Tabs } from "@mui/material";
import { i18n } from "../../translate/i18n";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ForbiddenPage from "../../components/ForbiddenPage";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    width: "100%",
    margin: 0,
  },
  card: {
    boxShadow: 'none',
    borderRadius: 8,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    boxShadow: 'none',
    borderRadius: 8,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    boxShadow: 'none',
    borderRadius: 8,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  overline: {
    fontWeight: 500,
    letterSpacing: 1,
  },
  h4: {
    fontWeight: 700,
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    borderRadius: '8px 8px 0 0',
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
  dialogActions: {
    padding: theme.spacing(2),
    justifyContent: "flex-end",
  },
  chartContainer: {
    flex: 1,
    minHeight: "400px",
  },
}));

const PerformanceCard = ({ title, value, max, color }) => {
  const percentage = (value / max) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight="500">
          {percentage.toFixed(1)}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 16,
          borderRadius: 8,
          bgcolor: `${color}15`,
          "& .MuiLinearProgress-bar": {
            borderRadius: 8,
            background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
          },
        }}
      />
    </Box>
  );
};

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState({
    series: [
      {
        name: "Em Atendimento",
        data: [0],
      },
      {
        name: "Aguardando",
        data: [0],
      },
      {
        name: "Finalizados",
        data: [0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Status dos Tickets"],
      },
      yaxis: {
        title: {
          text: "Quantidade",
        },
      },
      colors: ["#5D9CEC", "#48CFAD", "#A0D468"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: ["#5D9CEC", "#48CFAD", "#A0D468"],
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },
      legend: {
        position: "top",
      },
    },
  });

  const theme = useTheme();
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [filterType, setFilterType] = useState(1);
  const [period, setPeriod] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  const [tab, setTab] = useState("Indicadores");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedQueues, setSelectedQueues] = useState([]);

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let nowIni = `${year}-${month < 10 ? `0${month}` : `${month}`}-01`;
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;

  const [showFilter, setShowFilter] = useState(false);
  const [dateStartTicket, setDateStartTicket] = useState(nowIni);
  const [dateEndTicket, setDateEndTicket] = useState(now);
  const [queueTicket, setQueueTicket] = useState(false);
  const [fetchDataFilter, setFetchDataFilter] = useState(false);

  const { user } = useContext(AuthContext);

  const exportarGridParaExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('grid-attendants'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RelatorioDeAtendentes');
    XLSX.writeFile(wb, 'relatorio-de-atendentes.xlsx');
  };

  var userQueueIds = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataFilter]);

  useEffect(() => {
    if (counters.supportHappening !== undefined && counters.supportPending !== undefined && counters.supportFinished !== undefined) {
      setBarChartData({
        ...barChartData,
        series: [
          {
            name: "Em Atendimento",
            data: [counters.supportHappening],
          },
          {
            name: "Aguardando",
            data: [counters.supportPending],
          },
          {
            name: "Finalizados",
            data: [counters.supportFinished],
          },
        ],
      });
    }
  }, [counters]);

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateStartTicket) && moment(dateStartTicket).isValid()) {
      params = {
        ...params,
        date_from: moment(dateStartTicket).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateEndTicket) && moment(dateEndTicket).isValid()) {
      params = {
        ...params,
        date_to: moment(dateEndTicket).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setSelectedUsers(users);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const GetUsers = () => {
    let count;
    let userOnline = 0;
    attendants.forEach(user => {
      if (user.online === true) {
        userOnline = userOnline + 1
      }
    });
    count = userOnline === 0 ? 0 : userOnline;
    return count;
  };

  const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    } else {
      props = {
        dateStart: dateStartTicket,
        dateEnd: dateEndTicket,
      };
    }
    const { count } = useContacts(props);
    return count;
  };

  const GetMessages = (all, fromMe) => {
    let props = {};
    if (all) {
      if (fromMe) {
        props = {
          fromMe: true
        };
      } else {
        props = {
          fromMe: false
        };
      }
    } else {
      if (fromMe) {
        props = {
          fromMe: true,
          dateStart: dateStartTicket,
          dateEnd: dateEndTicket,
        };
      } else {
        props = {
          fromMe: false,
          dateStart: dateStartTicket,
          dateEnd: dateEndTicket,
        };
      }
    }
    const { count } = useMessages(props);
    return count;
  };

  function toggleShowFilter() {
    setShowFilter(!showFilter);
  }

  return (
    <>
      {
        user.profile === "user" && user.showDashboard === "disabled" ?
          <ForbiddenPage />
          :
          <>
            <div>
              <Container maxWidth={false} className={classes.container} disableGutters>
                <Grid2 container spacing={2} className={classes.container}>
                  {/* FILTROS */}
                  <Grid2 xs={12}>
                    <Button
                      onClick={toggleShowFilter}
                      style={{ float: "right" }}
                      color="primary"
                    >
                      {!showFilter ? (
                        <FilterListIcon />
                      ) : (
                        <ClearIcon />
                      )}
                    </Button>
                  </Grid2>

                  {/* POP-UP DE FILTRO */}
                  <Dialog
                    open={showFilter}
                    onClose={toggleShowFilter}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                      style: {
                        borderRadius: 8,
                      },
                    }}
                  >
                    <DialogTitle className={classes.dialogTitle}>
                      Filtros
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                      <Filters
                        classes={classes}
                        setDateStartTicket={setDateStartTicket}
                        setDateEndTicket={setDateEndTicket}
                        dateStartTicket={dateStartTicket}
                        dateEndTicket={dateEndTicket}
                        setQueueTicket={setQueueTicket}
                        queueTicket={queueTicket}
                        fetchData={setFetchDataFilter}
                      />
                    </DialogContent>
                    <DialogActions className={classes.dialogActions}>
                      <Button
                        onClick={toggleShowFilter}
                        style={{
                          color: "white",
                          backgroundColor: "#db6565",
                          boxShadow: "none",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                      >
                        Fechar
                      </Button>
                      <Button
                        onClick={() => { setFetchDataFilter(!fetchDataFilter); toggleShowFilter(); }}
                        style={{
                          color: "white",
                          backgroundColor: "#437db5",
                          boxShadow: "none",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                        variant="contained"
                      >
                        Aplicar
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <TabPanel
                    className={classes.container}
                    value={tab}
                    name={"Indicadores"}
                  >
                    <Container maxWidth={false} disableGutters>
                      <Grid2 container spacing={2}>
                        {/* EM ATENDIMENTO */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#5D9CEC", // Azul frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.inAttendance")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}>
                                    {counters.supportHappening}
                                  </Typography>
                                </Stack>
                                <Avatar
                                  sx={{
                                    backgroundColor: '#5D9CEC',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <CallIcon />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* AGUARDANDO */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#48CFAD", // Verde água frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.waiting")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}
                                  >
                                    {counters.supportPending}
                                  </Typography>
                                </Stack>
                                <Avatar
                                  sx={{
                                    backgroundColor: '#48CFAD',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <HourglassEmptyIcon />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* FINALIZADOS */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#A0D468", // Verde claro frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.finalized")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}
                                  >
                                    {counters.supportFinished}
                                  </Typography>
                                </Stack>
                                <Avatar
                                  sx={{
                                    backgroundColor: '#A0D468',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <CheckCircleIcon />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* GRUPOS */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#AC92EC", // Lilás frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.groups")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}
                                  >
                                    {counters.supportGroups}
                                  </Typography>
                                </Stack>

                                <Avatar
                                  sx={{
                                    backgroundColor: '#AC92EC',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <Groups />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* ATENDENTES ATIVOS */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#4FC1E9", // Azul claro frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.activeAttendants")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}
                                  >
                                    {GetUsers()}/{attendants.length}
                                  </Typography>
                                </Stack>
                                <Avatar
                                  sx={{
                                    backgroundColor: '#4FC1E9',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <RecordVoiceOverIcon />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* NOVOS CONTATOS */}
                        <Grid2 xs={12} sm={6} lg={4}>
                          <Card className={classes.card} sx={{
                            height: "100%",
                            backgroundColor: "#967ADC", // Roxo frio
                            color: 'white',
                            boxShadow: 'none',
                            borderRadius: 2,
                          }}>
                            <CardContent>
                              <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                              >
                                <Stack spacing={1}>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="overline"
                                    className={classes.overline}
                                  >
                                    {i18n.t("dashboard.cards.newContacts")}
                                  </Typography>
                                  <Typography
                                    style={{ color: 'white' }}
                                    variant="h4"
                                    className={classes.h4}
                                  >
                                    {counters.leads}
                                  </Typography>
                                </Stack>
                                <Avatar
                                  sx={{
                                    backgroundColor: '#967ADC',
                                    height: 60,
                                    width: 60
                                  }}
                                >
                                  <SvgIcon>
                                    <GroupAddIcon />
                                  </SvgIcon>
                                </Avatar>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid2>

                        {/* GRÁFICO DE BARRAS */}
                        <Grid2 xs={12} md={6}>
                          <Paper elevation={0} className={classes.fixedHeightPaper}>
                            <Typography variant="h6" align="center" gutterBottom>
                              TOTAL DE ATENDIMENTOS
                            </Typography>
                            <Box className={classes.chartContainer}>
                              <Chart
                                options={barChartData.options}
                                series={barChartData.series}
                                type="bar"
                                height="100%"
                              />
                            </Box>
                          </Paper>
                        </Grid2>

                        {/* TOTAL DE ATENDIMENTOS POR USUÁRIO */}
                        <Grid2 xs={12} md={6}>
                          <Paper elevation={0} className={classes.fixedHeightPaper2}>
                            <Typography variant="h6" align="center" gutterBottom>
                              TOTAL DE ATENDIMENTOS POR USUÁRIO
                            </Typography>
                            <Box className={classes.chartContainer}>
                              <ChatsUser />
                            </Box>
                          </Paper>
                        </Grid2>

                        {/* TOTAL DE ATENDIMENTOS */}
                        <Grid2 xs={12}>
                          <Paper elevation={0} className={classes.fixedHeightPaper2}>
                            <ChartsDate />
                          </Paper>
                        </Grid2>

                        {/* Card de Performance */}
                        <Grid2 xs={12}>
                          <Card
                            sx={{
                              mt: 4,
                              borderRadius: 2,
                              background: "rgba(255,255,255,0.95)",
                              backdropFilter: "blur(20px)",
                              boxShadow: "none",
                            }}
                          >
                            <CardContent>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                              >
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  Desempenho
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {GetUsers()}/{attendants.length} atendentes ativos
                                </Typography>
                              </Stack>

                              <Grid2 container spacing={3}>
                                <Grid2 xs={12} md={6}>
                                  <PerformanceCard
                                    title="Taxa de Resolução"
                                    value={counters.supportFinished || 0}
                                    max={
                                      counters.supportFinished + counters.supportPending || 1
                                    }
                                    color={theme.palette.primary.main}
                                  />
                                </Grid2>
                                <Grid2 xs={12} md={6}>
                                  <PerformanceCard
                                    title="Tempo Médio de Resposta"
                                    value={counters.avgResponseTime || 0}
                                    max={counters.maxResponseTime || 60}
                                    color={theme.palette.warning.main}
                                  />
                                </Grid2>
                              </Grid2>
                            </CardContent>
                          </Card>
                        </Grid2>
                      </Grid2>
                    </Container>
                  </TabPanel>
                </Grid2>
              </Container>
            </div>
          </>
      }
    </>
  );
};

export default Dashboard;