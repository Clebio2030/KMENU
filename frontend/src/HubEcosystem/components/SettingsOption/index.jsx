import React, { useEffect, useState } from 'react';

import { Tab, Tabs } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { toast } from 'react-toastify';

function SettingsOption({ classes, updateSetting, settings }) {
  const [notificameHub, setNotificameHub] = useState('');
  const [loadingNotificameHub, setLoadingNotificameHub] = useState(false);

  const handleChangeNotificameHub = async (value) => {
    const prevValue = notificameHub;

    setLoadingNotificameHub(true);
    try {
      setNotificameHub(value);
      await updateSetting({
        key: 'notificameHub',
        value,
      });

      toast.success('Operação atualizada com sucesso.');
    } catch (error) {
      setNotificameHub(prevValue);
      toast.error('Houve um erro ao tentar atualizar o token do Hub.');
    } finally {
      setLoadingNotificameHub(false);
    }
  }

  useEffect(() => {
    if (Array.isArray(settings) && settings.length) {
      const hubSetting = settings.find(s => s.key === 'notificameHub');
      if (hubSetting) {
        setNotificameHub(hubSetting.value);
      }
    }
  }, [settings, setNotificameHub]);

  return (
    <Grid spacing={3} container style={{ marginBottom: 10 }}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="on"
        variant="scrollable"
        className={classes.tab}
      >
        <Tab label="Notificame HUB" />
      </Tabs>
      <Grid xs={12} sm={12} md={12} item>
        <FormControl className={classes.selectContainer}>
          <TextField
            id="HUB"
            name="HUB"
            margin="dense"
            label="Token HUB"
            variant="outlined"
            value={notificameHub}
            onChange={e => handleChangeNotificameHub(e.target.value)}
          />
          <FormHelperText>{loadingNotificameHub && 'Atualizando...'}</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default SettingsOption;
