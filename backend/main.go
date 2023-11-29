package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/rs/cors"
)

var (
	todos []ToDo
)

type ToDo struct {
	Title       string
	Description string
	Id          int
}

func main() {
	mux := http.NewServeMux()

	todos = []ToDo{
		{Title: "Go for a jog", Description: "Run 4km around the river", Id: 0123},
		{Title: "Read a book", Description: "Finish 'Sapiens'", Id: 01234},
		// Add more fake To-Do items as needed
	}
	mux.HandleFunc("/list", ToDoListHandler)
	mux.HandleFunc("/add", AddToDoHandler)
	mux.HandleFunc("/delete", DeleteToDoHandler)

	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, "Error Encoding response", http.StatusInternalServerError)
		return
	}
}

func AddToDoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	var newToDo ToDo
	err := json.NewDecoder(r.Body).Decode(&newToDo)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	todos = append(todos, newToDo)

	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, "Error Encoding response", http.StatusInternalServerError)
		return
	}
}
func DeleteToDoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	var idToDelete int
	err := json.NewDecoder(r.Body).Decode(&idToDelete)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	indexToDelete := -1
	for i, todo := range todos {
		if todo.Id == idToDelete {
			indexToDelete = i
			break
		}
	}

	if indexToDelete != -1 {
		todos = append(todos[:indexToDelete], todos[indexToDelete+1:]...)
	} else {
		println("Could not find todo to delete")
	}

	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, "Error Encoding response", http.StatusInternalServerError)
		return
	}
}
