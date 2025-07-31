import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Hidden } from "@material-ui/core";

import MomentsUser from "../../components/MomentsUser";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    width: '100%',
    height: 'calc(100vh - 64px)', // Subtrai a altura do header
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
    boxSizing: 'border-box',
  },
  headerContainer: {
    width: '100%',
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  mainPaper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
    },
  },
  contentWrapper: {
    flex: 1,
    overflow: 'auto',
    ...theme.scrollbarStyles,
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
    },
  },
  title: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem',
    },
  },
}));

const ChatMoments = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  if (user.profile === "user" && user.allowRealTime === "disabled") {
    return <ForbiddenPage />;
  }

  return (
    <div className={classes.root}>
      <MainHeader>
        <Grid container className={classes.headerContainer}>
          <Grid item xs={12}>
            <Title className={classes.title}>Painel de Atendimentos</Title>
          </Grid>
        </Grid>
      </MainHeader>

      <div className={classes.container}>
        <Paper className={classes.mainPaper}>
          <div className={classes.contentWrapper}>
            <MomentsUser />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ChatMoments;