import React, { useEffect, useReducer, useState, useContext } from "react";

import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import QueueModal from "../../components/QueueModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
// import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import ForbiddenPage from "../../components/ForbiddenPage";
import AddIcon from '@mui/icons-material/Add';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    const newQueues = [];

    queues.forEach((queue) => {
      const queueIndex = state.findIndex((q) => q.id === queue.id);
      if (queueIndex !== -1) {
        state[queueIndex] = queue;
      } else {
        newQueues.push(queue);
      }
    });

    return [...state, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    const queueIndex = state.findIndex((u) => u.id === queue.id);

    if (queueIndex !== -1) {
      state[queueIndex] = queue;
      return [...state];
    } else {
      return [queue, ...state];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    const queueIndex = state.findIndex((q) => q.id === queueId);
    if (queueIndex !== -1) {
      state.splice(queueIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Queues = () => {
  const classes = useStyles();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  //   const socketManager = useContext(SocketContext);
  const { user, socket } = useContext(AuthContext);
  const companyId = user.companyId;


  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {

    const onQueueEvent = (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    };
    socket.on(`company-${companyId}-queue`, onQueueEvent);

    return () => {
      socket.off(`company-${companyId}-queue`, onQueueEvent);
    };
  }, [socket, companyId]);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = (queue) => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (queueId) => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Fila deletada com Sucesso"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QueueModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
        onEdit={(res) => {
          if (res) {
            setTimeout(() => {
              handleEditQueue(res)
            }, 500)
          }
        }}
      />
      {user.profile === "user" ?
        <ForbiddenPage />
        :
        <>
          <MainHeader>
            <Title>{i18n.t("queues.title")} ({queues.length})</Title>
            <MainHeaderButtonsWrapper>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                style={{
                color: "white",
                backgroundColor: "#FFA500",
                boxShadow: "none",
                borderRadius: "5px",
                }}
                onClick={handleOpenQueueModal}
              >
                {i18n.t("queues.buttons.add")}
              </Button>
            </MainHeaderButtonsWrapper>
          </MainHeader>
          <Paper className={classes.mainPaper} variant="outlined">
<Grid container spacing={2}>
  {queues.map((queue) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={queue.id}>
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
        <CardHeader
          title={queue.name}
         // subheader={`${i18n.t("queues.table.ID")}: ${queue.id}`}
          titleTypographyProps={{ align: "center" }}
          subheaderTypographyProps={{ align: "center" }}
        />
        <CardContent>

          <div
            style={{
              backgroundColor: queue.color,
              width: 60,
              height: 20,
              margin: "0 auto",
              borderRadius: 4,
            }}
          />
          <Typography variant="body2" align="center" style={{ marginTop: 10 }}>
            {i18n.t("Ordenação")}: {queue.orderQueue}
          </Typography>

        </CardContent>
<CardActions style={{ justifyContent: "center", gap: "10px" }}>
  <div
    onClick={() => handleEditQueue(queue)}
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
    <Edit style={{ color: "#fff" }} />
  </div>

  <div
    onClick={() => {
      setSelectedQueue(queue);
      setConfirmModalOpen(true);
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
    <DeleteOutline style={{ color: "#fff" }} />
  </div>
</CardActions>

      </Card>
    </Grid>
  ))}
  {loading && (
    <Grid item xs={12}>
      <CircularProgress style={{ display: "block", margin: "0 auto" }} />
    </Grid>
  )}
</Grid>
          </Paper>
        </>}
    </MainContainer>
  );
};

export default Queues;
