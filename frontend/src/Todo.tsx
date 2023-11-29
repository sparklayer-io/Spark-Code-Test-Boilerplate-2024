import React from 'react';
import './App.css';

export type TodoType = {
  Title: string,
  Description: string,
  Id:number,
  DeleteFunc: () => Promise<void>;
}



function Todo({ Title, Description, DeleteFunc }: TodoType) {
  const handleDelete = () => {
    DeleteFunc();
    }

  return (
    <div className="todo">
      <div className="todo-details">
        <p className="todo-title">{Title}</p>
        <p className="todo-description">{Description}</p>
      </div>
      <button className="button red" onClick={handleDelete}>Delete
      </button>
    </div>
  );
}

export default Todo;
