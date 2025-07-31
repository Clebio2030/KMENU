import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Typography, Grid, Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    paddingBottom: 100,
  },
  mainHeader: {
    marginTop: theme.spacing(1),
  },
  elementMargin: {
    padding: theme.spacing(2),
  },
  formContainer: {
    width: "100%",  // Garantir que a largura da FormControl seja 100%
    margin: theme.spacing(2, 0),
  },
  select: {
    width: "100%", // Faz o select ocupar toda a largura disponível
    maxWidth: 600, // Define uma largura máxima
    height: 45, // Aumenta a altura do select
    border: "2px solid #4caf50", // Borda verde destacada
    borderRadius: "4px",
    "&:hover": {
      borderColor: "#388e3c", // Cor da borda ao passar o mouse
    },
    "&.Mui-focused": {
      borderColor: "#81c784", // Cor da borda quando selecionado
    },
    backgroundColor: "#e8f5e9", // Cor de fundo leve
    fontSize: "16px", // Aumenta o tamanho da fonte
  },
  inputLabel: {
    color: "#388e3c", // Cor do label
    fontWeight: "bold",
    width: "100%", // Garantir que o label ocupe toda a largura disponível
  },
  preCode: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
  },
}));


const ApiDocumentation = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState("React");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const codeExamples = {
    React: `// React example code
fetch('https://demo5.kmenu.com.br/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username: 'usuario', password: 'senha' }),
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    Javascript: `// JavaScript example code
fetch('https://demo5.kmenu.com.br/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username: 'usuario', password: 'senha' }),
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    Python: `# Python example code
import requests

url = 'https://demo5.kmenu.com.br/api/auth/login'
data = { 'username': 'usuario', 'password': 'senha' }
response = requests.post(url, json=data)

print(response.json())`,
    PHP: `<?php
// PHP example code
$url = 'https://demo5.kmenu.com.br/api/auth/login';
$data = array('username' => 'usuario', 'password' => 'senha');

$options = array(
  'http' => array(
    'method'  => 'POST',
    'header'  => 'Content-Type: application/json',
    'content' => json_encode($data),
  ),
);

$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response;`,
    Vue: `<template>
  <div>
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      fetch('https://demo5.kmenu.com.br/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'usuario', password: 'senha' }),
      })
        .then(response => response.json())
        .then(data => console.log(data));
    },
  },
};
</script>`,
    Laravel: `<?php
// Laravel example code
use Illuminate\Support\Facades\Http;

$response = Http::post('https://demo5.kmenu.com.br/api/auth/login', [
    'username' => 'usuario',
    'password' => 'senha',
]);

dd($response->json());`,
  };

  return (
    <Paper className={classes.mainPaper} variant="outlined">
      <Typography variant="h5">Documentação da API</Typography>

      {/* Combobox para selecionar a linguagem */}
<FormControl className={classes.formContainer}>
  <InputLabel id="language-select-label" className={classes.inputLabel}>Selecione a Linguagem</InputLabel>
  <Select
    labelId="language-select-label"
    id="language-select"
    value={language}
    onChange={handleLanguageChange}
    className={classes.select}
  >
    <MenuItem value="React">React</MenuItem>
    <MenuItem value="Javascript">JavaScript</MenuItem>
    <MenuItem value="Python">Python</MenuItem>
    <MenuItem value="PHP">PHP</MenuItem>
    <MenuItem value="Vue">Vue</MenuItem>
    <MenuItem value="Laravel">Laravel</MenuItem>
  </Select>
</FormControl>


      {/* Exemplo de código baseado na linguagem selecionada */}
      <Typography variant="h6" className={classes.elementMargin}>
        Exemplo de código na linguagem {language}:
      </Typography>
      <pre className={classes.preCode}>
        {codeExamples[language]}
      </pre>

      {/* 1. Autenticação */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        1. Autenticação
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /auth/login
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/auth/login
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "username": "usuario",
  "password": "senha"
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 2. Tickets */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        2. Tickets
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            GET /ticket/list
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/ticket/list
          </span>
          <br />
          <pre className={classes.preCode}>
            {`curl https://demo5.kmenu.com.br/api/ticket/list`}
          </pre>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /ticket/create
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/ticket/create
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "title": "Novo ticket de teste",
  "description": "Descrição do problema",
  "priority": "alta"
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 3. Mensagens */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        3. Mensagens
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            GET /message/list
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/message/list
          </span>
          <br />
          <pre className={classes.preCode}>
            {`curl https://demo5.kmenu.com.br/api/message/list`}
          </pre>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /message/send
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/message/send
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "recipient": "João",
  "message": "Oi, como você está?"
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 4. Contatos */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        4. Contatos
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            GET /contact/list
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/contact/list
          </span>
          <br />
          <pre className={classes.preCode}>
            {`curl https://demo5.kmenu.com.br/api/contact/list`}
          </pre>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /contact/create
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/contact/create
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "name": "Lucas Pereira",
  "phone": "1122334455"
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 5. Faturas */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        5. Faturas
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            GET /invoice/list
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/invoice/list
          </span>
          <br />
          <pre className={classes.preCode}>
            {`curl https://demo5.kmenu.com.br/api/invoice/list`}
          </pre>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /invoice/create
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/invoice/create
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "amount": 200.00,
  "due_date": "2025-03-10",
  "customer_id": 1
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 6. Webhook */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        6. Webhook
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /webhook
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/webhook
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "event": "new_ticket",
  "data": {
    "ticket_id": 1,
    "title": "Novo problema",
    "status": "aberto"
  }
}`}
          </pre>
        </Typography>
      </Grid>

      {/* 7. Sessões do WhatsApp */}
      <Typography variant="h6" color="primary" className={classes.elementMargin}>
        7. Sessões do WhatsApp
      </Typography>
      <Grid item xs={12} sm={6}>
        <Typography className={classes.elementMargin} component="div">
          <Typography variant="h6" component="span" style={{ fontWeight: "bold" }}>
            POST /whatsapp/session
          </Typography>
          <br />
          <span style={{ color: "green" }}>
            URL: https://demo5.kmenu.com.br/api/whatsapp/session
          </span>
          <br />
          <pre className={classes.preCode}>
            {`{
  "phone_number": "11987654321",
  "session_name": "Sessão WhatsApp 1"
}`}
          </pre>
        </Typography>
      </Grid>
    </Paper>
  );
};

export default ApiDocumentation;
