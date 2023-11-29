import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newToDo, setNewTodo] = useState({title: '', description:'',id:5});
  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/list');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
        
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);


  const hash = (inputWord: string): number => {
    let hash = 0;
    
    if (inputWord.length === 0) return hash;
    console.log(inputWord.length);
    for (let i = 0; i < inputWord.length; i++) {
        const char = inputWord.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
 
    return hash;
  }

  
  const addToDo = async () => {
    setNewTodo((prevState) => ({
      ...prevState,
      id: hash(newToDo.title),
    }));
    const updatedNewToDo = {
      ...newToDo,
      id: hash(newToDo.title),
    };
    try {
      const response = await fetch('http://localhost:8080/add',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(updatedNewToDo),
    });
    
    if(!response.ok){
      console.log('Error adding TodDo')
      return;
    }
    const updatedTodos = await response.json()
    setTodos(updatedTodos);
    } catch (e) {
      console.log('Could not connect to server. Ensure it is running. ' + e);
    }
  }

  const DeleteToDo = async(Id:number)=> {
    
    try {
      const response = await fetch('http://localhost:8080/delete',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(Id),
    });
    
    if(!response.ok){
      console.log('Error removing TodDo')
      return;
    }
    const updatedTodos = await response.json()
    setTodos(updatedTodos);
    } catch (e) {
      console.log('Could not connect to server. Ensure it is running. ' + e);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setNewTodo(prevState =>({
      ...prevState,
      [name]:value,
    }));
  }
  

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.Title + todo.Description}
            Title={todo.Title}
            Description={todo.Description}
            Id={todo.Id}
            DeleteFunc = {() => DeleteToDo(todo.Id)}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form>
        <input placeholder="Title" name="title" value={newToDo.title} onChange={handleInputChange} autoFocus={true} />
        <input placeholder="Description" name="description" value={newToDo.description} onChange={handleInputChange}/>
        <button onClick={addToDo} >Add Todo</button>
      </form>
    </div>
  );
}

export default App;
