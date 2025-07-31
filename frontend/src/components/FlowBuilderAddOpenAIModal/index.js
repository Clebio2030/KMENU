import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { InputAdornment, IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { i18n } from "../../translate/i18n";
import TextField from "@material-ui/core/TextField";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  extraAttr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    padding: "20px",
  },
  customButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: "white",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#f44336",
    color: "white",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  popupButtonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    padding: "20px",
  },
}));

const DialogflowSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const FlowBuilderOpenAIModal = ({ open, onSave, data, onUpdate, close }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const handleToggleApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const initialState = {
    name: "",
    prompt: "",
    voice: "texto",
    voiceKey: "",
    voiceRegion: "",
    maxTokens: 100,
    temperature: 1,
    apiKey: "",
    queueId: null,
    maxMessages: 10,
  };

  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("texto");
  const [activeModal, setActiveModal] = useState(false);
  const [integration, setIntegration] = useState(initialState);
  const [labels, setLabels] = useState({
    title: "Adicionar OpenAI ao fluxo",
    btn: "Adicionar",
  });
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (open === "edit") {
      setLabels({
        title: "Editar OpenAI do fluxo",
        btn: "Salvar",
      });
      setIntegration({
        ...data.data.typebotIntegration,
      });
      setActiveModal(true);
    } else if (open === "create") {
      setLabels({
        title: "Cria OpenAI no fluxo",
        btn: "Salvar",
      });
      setIntegration(initialState);
      setActiveModal(true);
    }

    return () => {
      isMounted.current = false;
    };
  }, [open]);

  const handleClose = () => {
    close(null);
    setActiveModal(false);
  };

  const handleChangeVoice = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleSavePrompt = (values) => {
    if (open === "edit") {
      handleClose();
      onUpdate({
        ...data,
        data: { typebotIntegration: { ...values, voice: selectedVoice } },
      });
    } else if (open === "create") {
      values.projectName = values.name;
      handleClose();
      onSave({
        typebotIntegration: {
          ...values,
          voice: selectedVoice,
        },
      });
    }
  };

  const buttons = [
    "Clínica Médica", "Salão", "Lojas de Roupa", "Advocacia",
    "Assistência Técnica", "Lojas de Eletrônicos", "Loja de Presentes",
    "Entrega de Gás", "Contabilidade", "Doceria",
    "Cursos"
  ];

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleButtonClick = (button, setFieldValue) => {
    let prompt = "";

    switch (button) {
      case "Clínica Médica":
        prompt = `
[Saudação automática conforme horário]
"Bom dia! Seja bem-vindo à Clínica KMENU, especializada em saúde do homem. Para começarmos, poderia me informar seu nome completo e idade, por favor? Assim, posso te oferecer um atendimento personalizado."

[Após coleta do nome e idade]
"Obrigado, [Nome]! Em que posso ajudar hoje? Você gostaria de agendar uma consulta ou tem alguma dúvida sobre nossos serviços?"

[Se o paciente perguntar sobre os médicos]
"Claro! Aqui estão os profissionais disponíveis atualmente na Clínica KMENU:

Dr. Marcos - Cardiologista

Dr. Carlos - Clínico Geral

Dra. Márcia - Psicóloga

Você gostaria de saber mais sobre alguma especialidade ou valores das consultas?"

[Se o paciente perguntar sobre valores]
"Com prazer! Os valores das consultas são:

Cardiologista: R$600,00

Clínico Geral: R$400,00

Psicóloga: R$350,00

Qual especialidade você deseja agendar?"

[Após escolha da especialidade e profissional]
"Entendido, [Nome]! Vou verificar a disponibilidade para você. Qual dia e horário você prefere dentro do nosso horário de funcionamento (segunda a sexta, das 08:30 às 19:30)?"

[Após escolha do dia e horário]
"Fico feliz em ajudar! Sua consulta com o(a) [Especialidade/Profissional] foi agendada para [data] às [horário]. Nosso endereço é Rua Macaira, 400, Bairro Aquário, Vinhedo/SP. Recomendo chegar com 10 minutos de antecedência."

[Encerramento cordial]
"Obrigado por escolher a Clínica KMENU. Estamos à disposição para cuidar da sua saúde. Qualquer dúvida, estamos à disposição! Nos vemos na sua consulta, [Nome]! Cuide-se bem!"
        `;
        break;

      case "Salão":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) ao Salão Beleza Total. Como posso ajudar você hoje? Gostaria de agendar um horário para corte, coloração ou outro serviço?"

[Se o cliente perguntar sobre serviços]
"Claro! Oferecemos os seguintes serviços:

- Corte de cabelo: R$50,00
- Coloração: R$120,00
- Manicure e pedicure: R$40,00
- Tratamentos capilares: R$80,00

Qual serviço você deseja agendar?"

[Após escolha do serviço]
"Perfeito! Para qual dia e horário você gostaria de agendar? Nosso horário de funcionamento é de terça a sábado, das 09:00 às 18:00."

[Após escolha do dia e horário]
"Seu horário foi agendado com sucesso! Aguardamos você no dia [data] às [horário]. Nosso endereço é Rua das Flores, 123, Centro. Qualquer dúvida, estamos à disposição!"
        `;
        break;

      case "Lojas de Roupa":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Loja Fashion Style. Temos uma grande variedade de roupas, calçados e acessórios. Como posso ajudar você hoje?"

[Se o cliente perguntar sobre promoções]
"Temos várias promoções incríveis esta semana:

- Camisetas a partir de R$29,90
- Calças jeans com 30% de desconto
- Tênis com até 50% off

Você gostaria de saber mais sobre algum produto?"

[Se o cliente perguntar sobre tamanhos]
"Temos todos os tamanhos disponíveis, do P ao GG. Posso te ajudar a encontrar o tamanho ideal?"

[Encerramento cordial]
"Obrigado por escolher a Fashion Style! Esperamos que você encontre o que procura. Qualquer dúvida, estamos à disposição!"
        `;
        break;

      case "Advocacia":
        prompt = `
[Saudação automática conforme horário]
"Bom dia! Bem-vindo(a) ao Escritório de Advocacia Justiça & Direito. Como posso ajudar você hoje? Gostaria de agendar uma consulta ou tem alguma dúvida jurídica?"

[Se o cliente perguntar sobre áreas de atuação]
"Atuamos nas seguintes áreas:

- Direito Civil
- Direito Trabalhista
- Direito Familiar
- Direito Empresarial

Qual área você precisa de assistência?"

[Se o cliente perguntar sobre valores]
"Os valores variam conforme o tipo de serviço. Para consultas iniciais, cobramos R$300,00. Posso agendar um horário para você?"

[Após escolha do dia e horário]
"Sua consulta foi agendada para [data] às [horário]. Nosso endereço é Avenida Principal, 456, Sala 101. Aguardamos você!"
        `;
        break;

      case "Assistência Técnica":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Assistência Técnica EletroPlus. Como posso ajudar você hoje? Precisa de reparo para algum aparelho eletrônico?"

[Se o cliente perguntar sobre serviços]
"Oferecemos assistência para:

- Celulares e tablets
- Computadores e notebooks
- Eletrodomésticos
- TVs e monitores

Qual aparelho precisa de reparo?"

[Se o cliente perguntar sobre prazos]
"O prazo de reparo varia conforme o problema, mas geralmente é de 3 a 7 dias úteis. Posso agendar uma avaliação para você?"

[Após escolha do dia e horário]
"Perfeito! Sua avaliação foi agendada para [data] às [horário]. Nosso endereço é Rua da Tecnologia, 789. Aguardamos você!"
        `;
        break;

      case "Lojas de Eletrônicos":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à EletroTech. Temos os melhores produtos eletrônicos com os melhores preços. Como posso ajudar você hoje?"

[Se o cliente perguntar sobre produtos]
"Temos uma grande variedade de produtos, incluindo:

- Smartphones
- Notebooks
- TVs e monitores
- Acessórios

Você gostaria de saber mais sobre algum produto específico?"

[Se o cliente perguntar sobre garantia]
"Todos os nossos produtos têm garantia de 1 ano. Posso te ajudar com mais alguma coisa?"

[Encerramento cordial]
"Obrigado por escolher a EletroTech! Esperamos que você encontre o que procura. Qualquer dúvida, estamos à disposição!"
        `;
        break;

      case "Loja de Presentes":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Loja Presentes Especiais. Temos uma variedade de presentes para todas as ocasiões. Como posso ajudar você hoje?"

[Se o cliente perguntar sobre produtos]
"Temos presentes para:

- Aniversários
- Casamentos
- Datas comemorativas
- Presentes corporativos

Você gostaria de saber mais sobre algum produto?"

[Se o cliente perguntar sobre entrega]
"Oferecemos entrega em domicílio com prazo de 1 a 3 dias úteis. Posso te ajudar com mais alguma coisa?"

[Encerramento cordial]
"Obrigado por escolher a Presentes Especiais! Esperamos que você encontre o presente perfeito. Qualquer dúvida, estamos à disposição!"
        `;
        break;

      case "Entrega de Gás":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Gás Express. Como posso ajudar você hoje? Precisa de entrega de gás ou tem alguma dúvida?"

[Se o cliente perguntar sobre preços]
"O valor do botijão de 13kg é R$80,00, e o de 45kg é R$200,00. A entrega é gratuita para pedidos acima de R$100,00."

[Se o cliente perguntar sobre prazos]
"Entregamos em até 2 horas na região central. Para outras regiões, o prazo pode variar. Posso anotar seu pedido?"

[Após confirmação do pedido]
"Seu pedido foi registrado! Entregaremos o gás no endereço [endereço] em até [prazo]. Obrigado por escolher a Gás Express!"
        `;
        break;

      case "Contabilidade":
        prompt = `
[Saudação automática conforme horário]
"Bom dia! Bem-vindo(a) ao Escritório de Contabilidade Contabilize. Como posso ajudar você hoje? Precisa de serviços contábeis ou tem alguma dúvida?"

[Se o cliente perguntar sobre serviços]
"Oferecemos os seguintes serviços:

- Abertura de empresas
- Declaração de imposto de renda
- Consultoria financeira
- Folha de pagamento

Qual serviço você precisa?"

[Se o cliente perguntar sobre valores]
"Os valores variam conforme o serviço. Para abertura de empresas, cobramos R$500,00. Posso agendar uma consulta para você?"

[Após escolha do dia e horário]
"Sua consulta foi agendada para [data] às [horário]. Nosso endereço é Rua dos Contadores, 101. Aguardamos você!"
        `;
        break;

      case "Doceria":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Doceria Doce Sabor. Temos uma variedade de doces caseiros e sobremesas. Como posso ajudar você hoje?"

[Se o cliente perguntar sobre produtos]
"Temos:

- Bolos personalizados
- Docinhos para festas
- Tortas e sobremesas
- Doces diet e sem açúcar

Você gostaria de encomendar algo?"

[Se o cliente perguntar sobre prazos]
"Para encomendas, o prazo mínimo é de 2 dias. Posso anotar seu pedido?"

[Após confirmação do pedido]
"Seu pedido foi registrado! Entregaremos no endereço [endereço] no dia [data]. Obrigado por escolher a Doce Sabor!"
        `;
        break;

      case "Cursos":
        prompt = `
[Saudação automática conforme horário]
"Olá! Bem-vindo(a) à Escola de Cursos Profissionalizantes. Como posso ajudar você hoje? Gostaria de se inscrever em algum curso ou tem alguma dúvida?"

[Se o cliente perguntar sobre cursos]
"Oferecemos cursos nas seguintes áreas:

- Tecnologia da Informação
- Marketing Digital
- Design Gráfico
- Administração

Qual curso você tem interesse?"

[Se o cliente perguntar sobre valores]
"Os valores variam conforme o curso. Para mais informações, posso agendar uma visita ou ligação?"

[Após escolha do dia e horário]
"Perfeito! Sua visita foi agendada para [data] às [horário]. Nosso endereço é Rua do Conhecimento, 202. Aguardamos você!"
        `;
        break;

      default:
        prompt = "";
    }

    setFieldValue("prompt", prompt.trim());
    handlePopupClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={activeModal}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle className={classes.dialogTitle}>
          {open === "create" ? `Adicionar OpenAI ao fluxo` : `Editar OpenAI`}
        </DialogTitle>
        <Formik
          initialValues={integration}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSavePrompt(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form style={{ width: "100%" }}>
              <DialogContent dividers>
                {/* Botão para abrir o pop-up */}
                <Button
                  className={classes.customButton}
                  onClick={handlePopupOpen}
                  fullWidth
                >
                  Modelo de Prompts
                </Button>

                {/* Pop-up com botões das categorias */}
                <Dialog
                  open={popupOpen}
                  onClose={handlePopupClose}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle className={classes.dialogTitle}>
                    Selecione o Modelo
                  </DialogTitle>
                  <DialogContent>
                    <div className={classes.popupButtonGrid}>
                      {buttons.map((button, index) => (
                        <Button
                          key={index}
                          className={classes.customButton}
                          onClick={() => handleButtonClick(button, setFieldValue)}
                        >
                          {button}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handlePopupClose}
                      style={{
                      color: "white",
                      backgroundColor: "#db6565",
                      boxShadow: "none",
                      borderRadius: 0,
                      fontSize: "12px",
                      }}
                      variant="contained"
                    >
                      Fechar
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Campos do formulário */}
                <Field
                  as={TextField}
                  label={i18n.t("promptModal.form.name")}
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                />
                <FormControl fullWidth margin="dense" variant="outlined">
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.apikey")}
                    name="apiKey"
                    type={showApiKey ? "text" : "password"}
                    error={touched.apiKey && Boolean(errors.apiKey)}
                    helperText={touched.apiKey && errors.apiKey}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleToggleApiKey}>
                            {showApiKey ? <VisibilityOff style={{ color: "#db6565" }} /> : <Visibility style={{ color: "#437db5" }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <Field
                  as={TextField}
                  label={i18n.t("promptModal.form.prompt")}
                  name="prompt"
                  error={touched.prompt && Boolean(errors.prompt)}
                  helperText={touched.prompt && errors.prompt}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  rows={10}
                  multiline={true}
                />
                <div className={classes.multFieldLine}>
                  <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel>{i18n.t("promptModal.form.voice")}</InputLabel>
                    <Select
                      id="type-select"
                      labelWidth={60}
                      name="voice"
                      value={selectedVoice}
                      onChange={handleChangeVoice}
                      multiple={false}
                    >
                      <MenuItem key={"texto"} value={"texto"}>
                        Texto
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-FranciscaNeural"}
                        value={"pt-BR-FranciscaNeural"}
                      >
                        Francisa
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-AntonioNeural"}
                        value={"pt-BR-AntonioNeural"}
                      >
                        Antônio
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-BrendaNeural"}
                        value={"pt-BR-BrendaNeural"}
                      >
                        Brenda
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-DonatoNeural"}
                        value={"pt-BR-DonatoNeural"}
                      >
                        Donato
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-ElzaNeural"}
                        value={"pt-BR-ElzaNeural"}
                      >
                        Elza
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-FabioNeural"}
                        value={"pt-BR-FabioNeural"}
                      >
                        Fábio
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-GiovannaNeural"}
                        value={"pt-BR-GiovannaNeural"}
                      >
                        Giovanna
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-HumbertoNeural"}
                        value={"pt-BR-HumbertoNeural"}
                      >
                        Humberto
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-JulioNeural"}
                        value={"pt-BR-JulioNeural"}
                      >
                        Julio
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-LeilaNeural"}
                        value={"pt-BR-LeilaNeural"}
                      >
                        Leila
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-LeticiaNeural"}
                        value={"pt-BR-LeticiaNeural"}
                      >
                        Letícia
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-ManuelaNeural"}
                        value={"pt-BR-ManuelaNeural"}
                      >
                        Manuela
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-NicolauNeural"}
                        value={"pt-BR-NicolauNeural"}
                      >
                        Nicolau
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-ValerioNeural"}
                        value={"pt-BR-ValerioNeural"}
                      >
                        Valério
                      </MenuItem>
                      <MenuItem
                        key={"pt-BR-YaraNeural"}
                        value={"pt-BR-YaraNeural"}
                      >
                        Yara
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.voiceKey")}
                    name="voiceKey"
                    error={touched.voiceKey && Boolean(errors.voiceKey)}
                    helperText={touched.voiceKey && errors.voiceKey}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.voiceRegion")}
                    name="voiceRegion"
                    error={touched.voiceRegion && Boolean(errors.voiceRegion)}
                    helperText={touched.voiceRegion && errors.voiceRegion}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>

                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.temperature")}
                    name="temperature"
                    error={touched.temperature && Boolean(errors.temperature)}
                    helperText={touched.temperature && errors.temperature}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.max_tokens")}
                    name="maxTokens"
                    error={touched.maxTokens && Boolean(errors.maxTokens)}
                    helperText={touched.maxTokens && errors.maxTokens}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("promptModal.form.max_messages")}
                    name="maxMessages"
                    error={touched.maxMessages && Boolean(errors.maxMessages)}
                    helperText={touched.maxMessages && errors.maxMessages}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleClose}
	          style={{
                  color: "white",
                  backgroundColor: "#db6565",
                  boxShadow: "none",
                  borderRadius: 0,
                  fontSize: "12px",
                  }}
                  variant="contained"
                >
                  {i18n.t("contactModal.buttons.cancel")}
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  type="submit"
                  style={{
                    color: "white",
                    backgroundColor: "#437db5",
                    boxShadow: "none",
                    borderRadius: 0,
                    fontSize: "12px",
                  }}
                  variant="contained"
                  className={classes.btnWrapper}
                  disabled={isSubmitting}
                >
                  {open === "create" ? `Adicionar` : "Editar"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default FlowBuilderOpenAIModal;