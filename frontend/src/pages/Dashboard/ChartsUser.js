import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { i18n } from '../../translate/i18n';
import { AuthContext } from "../../context/Auth/AuthContext";
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChatsUser = () => {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState([]);
    const { user } = useContext(AuthContext);

    const companyId = user?.companyId;

    // Memoized fetch function
    const handleGetTicketsInformation = useCallback(async () => {
        if (!companyId) return;

        try {
            const { data } = await api.get(`/dashboard/ticketsUsers`, {
                params: {
                    initialDate: format(initialDate, 'yyyy-MM-dd'),
                    finalDate: format(finalDate, 'yyyy-MM-dd'),
                    companyId,
                },
            });
            setTicketsData(data?.data || []);
        } catch (error) {
            toast.error('Erro ao buscar informações dos tickets');
        }
    }, [initialDate, finalDate, companyId]);

    useEffect(() => {
        handleGetTicketsInformation();
    }, [handleGetTicketsInformation]);

    const pieData = {
        labels: ticketsData.map((item) => item.nome || 'Desconhecido'),
        datasets: [
            {
                data: ticketsData.map((item) => item.quantidade || 0),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw || 0;
                        const label = tooltipItem.label || 'Sem Nome';
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
       <div style={{ backgroundColor: '#ffffff', borderRadius: '0' }}>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {i18n.t("dashboard.users.totalCallsUser")}
    </Typography>

    <Grid container spacing={2} alignItems="center">
        <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                <DatePicker
                    value={initialDate}
                    onChange={setInitialDate}
                    label={i18n.t("dashboard.date.initialDate")}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </LocalizationProvider>
        </Grid>
        <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                <DatePicker
                    value={finalDate}
                    onChange={setFinalDate}
                    label={i18n.t("dashboard.date.finalDate")}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </LocalizationProvider>
        </Grid>
        <Grid item>
            <Button
                startIcon={<FilterListIcon />}
                style={{
                color: "white",
                backgroundColor: "#4ec24e",
                boxShadow: "none",
                borderRadius: "5px",
                }}
                onClick={handleGetTicketsInformation}
                variant="contained"
            >
                {i18n.t("FILTRAR")}
            </Button>
        </Grid>
    </Grid>

    <div style={{ marginTop: '20px', position: 'relative', height: '300px', textAlign: 'center' }}>
        {ticketsData.length > 0 ? (
            <div style={{ width: '250px', height: '250px', margin: '0 auto' }}>
                <Pie data={pieData} options={pieOptions} />
            </div>
        ) : (
            <Typography variant="body1" color="textSecondary" align="center">
                Nenhum dado disponível.
            </Typography>
        )}
    </div>
</div>

    );
};

export default ChatsUser;
