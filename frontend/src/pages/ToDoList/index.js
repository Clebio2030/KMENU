import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import EmojiPicker from 'emoji-picker-react';
import 'react-quill/dist/quill.snow.css';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '1rem',
  },
  editorContainer: {
    marginBottom: '5rem',
    width: '100%',
    '& .ql-container': {
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    },
    '& .ql-toolbar': {
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
  },
  editor: {
    height: '100px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    position: 'relative', // Adicionado para conter o picker de emojis
  },
  emojiPicker: {
    position: 'absolute',
    top: '50px', // Distância do botão
    right: '10px', // Ajuste horizontal do picker
    zIndex: 10, // Garantir que o picker fique acima de outros elementos
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  listContainer: {
    width: '100%',
    marginTop: '1rem',
    backgroundColor: theme.palette.background.primary,
    borderRadius: '5px',
  },
  list: {
    marginBottom: '5px',
    color: theme.palette.text.primary,
  },
}));

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        text: task,
        updatedAt: now,
        createdAt: newTasks[editIndex].createdAt,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleEmojiClick = (emojiData) => {
    setTask((prevTask) => prevTask + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={classes.root}>
      {/* Contêiner do Editor */}
      <div className={classes.editorContainer}>
        <ReactQuill
          className={classes.editor}
          value={task}
          onChange={setTask}
          theme="snow"
          placeholder="Digite sua tarefa aqui..."
        />
      </div>

      {/* Contêiner dos Botões */}
      <div className={classes.buttonContainer}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          style={{
            color: 'white',
            backgroundColor: '#437db5',
            boxShadow: 'none',
            borderRadius: "5px",
          }}
          onClick={handleAddTask}
        >
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
        <Button
          startIcon={<InsertEmoticonIcon />}
          style={{
            color: 'white',
            backgroundColor: '#FFA500',
            boxShadow: 'none',
            borderRadius: "5px",
          }}
          variant="contained"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          {showEmojiPicker ? 'Fechar Emojis' : 'Inserir Emoji'}
        </Button>

        {/* Picker de Emojis Flutuante */}
        {showEmojiPicker && (
          <div className={classes.emojiPicker}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Lista de Tarefas */}
      <div className={classes.listContainer}>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.list}>
              <ListItemText
                primary={
                  <div
                    dangerouslySetInnerHTML={{ __html: task.text }}
                  />
                }
                secondary={task.updatedAt.toLocaleString()}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditTask(index)}>
                  <EditIcon style={{ color: '#4ec24e' }} />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon style={{ color: '#db6565' }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;