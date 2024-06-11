package router

import (
	"github.com/deepaks2293/go-todo/middleware"
	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/tasktags", middleware.CreateTaskTag).Methods("POST", "OPTIONS")
	router.HandleFunc("/Newtasks", middleware.CreateTask).Methods("POST", "OPTIONS") // Add new route for creating tasks
	router.HandleFunc("/tags-count", middleware.TagsCountHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/tagsbydate", middleware.TasksByDateHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/tagsbyname", middleware.TasksByTagHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/tasks", middleware.TasksByDateCategoryHandler).Methods("GET", "OPTIONS")
	router.HandleFunc("/tasksdelete", middleware.DeleteTaskHandler).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/toggletaskstatus", middleware.ToggleTaskStatusHandler).Methods("PUT", "OPTIONS")
	return router
}
