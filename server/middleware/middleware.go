package middleware

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/deepaks2293/go-todo/models"
	_ "github.com/lib/pq"
)

// DB connection string
// Update this with your PostgreSQL connection string
const connectionString = "postgres://postgres:3y3@localhost:5432/todo?sslmode=disable"

var db *sql.DB

// create connection with PostgreSQL
func init() {
	var err error

	// Connect to PostgreSQL
	db, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to PostgreSQL!")
}

// GetDB returns the database connection
func GetDB() *sql.DB {
	return db
}

// TagCount represents the name and count of each tag
type TagCount struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

// TaskCount represents the count of tasks for each category
type TaskCount struct {
	TodayCount         int `json:"today_count"`
	TomorrowCount      int `json:"tomorrow_count"`
	AfterTomorrowCount int `json:"after_tomorrow_count"`
	PastCount          int `json:"past_count"`
	AllCount           int `json:"all_count"`
}

// getTagsCount retrieves the count of tasks for each tag from the database
func getTagsCount(db *sql.DB) ([]TagCount, error) {
	// Define the query to get all tags and their respective counts
	query := `
	SELECT name, (
		SELECT COUNT(*)
		FROM todolist
		WHERE tasktag = tasktags.name
) AS count
FROM tasktags;
	`

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate over the rows and build the result
	var tagCounts []TagCount
	for rows.Next() {
		var tagCount TagCount
		if err := rows.Scan(&tagCount.Name, &tagCount.Count); err != nil {
			return nil, err
		}
		tagCounts = append(tagCounts, tagCount)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tagCounts, nil
}

// tagsCountHandler handles the request to get tags and their counts
func TagsCountHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the tags count
	tagCounts, err := getTagsCount(db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tagCounts); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	var task models.ToDoList
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Format the createAt date
	if task.CreateAt == "" {
		task.CreateAt = models.FormatDate(time.Now())
	}

	// Insert task into the database
	query := `INSERT INTO todolist (task, taskdetail, status, createAt, tasktag) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	err = db.QueryRow(query, task.Task, task.TaskDetail, task.Status, task.CreateAt, task.TaskTagID).Scan(&task.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func CreateTaskTag(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	var taskTag models.TaskTag
	err := json.NewDecoder(r.Body).Decode(&taskTag)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert TaskTag into the database
	query := `INSERT INTO tasktags (name) VALUES ($1) RETURNING id`
	err = db.QueryRow(query, taskTag.Name).Scan(&taskTag.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(taskTag)
}

// getTasksByCategory retrieves the count of tasks for each category from the category_counts table
func getTasksByCategory() (TaskCount, error) {
	var taskCount TaskCount
	query := `
		SELECT today_count, tomorrow_count, after_tomorrow_count, past_count, all_count
		FROM category_counts
	`
	err := db.QueryRow(query).Scan(&taskCount.TodayCount, &taskCount.TomorrowCount, &taskCount.AfterTomorrowCount, &taskCount.PastCount, &taskCount.AllCount)
	if err != nil {
		return TaskCount{}, err
	}
	return taskCount, nil
}

// TagsCountHandler handles the request to get tags and their counts
func TasksByDateHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the task counts by category
	taskCount, err := getTasksByCategory()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(taskCount); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// getTasksByTag retrieves tasks based on the provided tag from the database
func getTasksByTag(db *sql.DB, tag string) ([]models.ToDoList, error) {
	query := `
		SELECT id, task, taskdetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag
		FROM todolist
		WHERE tasktag = $1
	`
	rows, err := db.Query(query, tag)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.ToDoList
	for rows.Next() {
		var task models.ToDoList
		if err := rows.Scan(&task.ID, &task.Task, &task.TaskDetail, &task.Status, &task.CreateAt, &task.TaskTagID); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

// TasksByTagHandler handles the request to get tasks by tag
func TasksByTagHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the tag from the query parameters
	tag := r.URL.Query().Get("tag")
	if tag == "" {
		http.Error(w, "Tag is required", http.StatusBadRequest)
		return
	}

	// Get the tasks by tag
	tasks, err := getTasksByTag(db, tag)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// getTasksByCategory retrieves tasks from the database based on the specified category.
func getTasksByDate(db *sql.DB, category string) ([]models.ToDoList, error) {
	// Define the SQL query based on the category
	var query string
	switch category {
	case "today":
		query = "SELECT id, task, taskDetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag FROM todolist WHERE createat >= CURRENT_DATE AND createat < CURRENT_DATE + INTERVAL '1 day'"
	case "tomorrow":
		query = "SELECT id, task, taskDetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag FROM todolist WHERE createat >= CURRENT_DATE + INTERVAL '1 day' AND createat < CURRENT_DATE + INTERVAL '2 days'"
	case "after-tomorrow":
		query = "SELECT id, task, taskDetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag FROM todolist WHERE createat >= CURRENT_DATE + INTERVAL '2 days' AND createat < CURRENT_DATE + INTERVAL '3 days'"
	case "past":
		query = "SELECT id, task, taskDetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag FROM todolist WHERE createat < CURRENT_DATE"
	case "all":
		query = "SELECT id, task, taskDetail, status, to_char(createAt, 'YYYY-MM-DD') AS createAt, tasktag FROM todolist"
	default:
		return nil, fmt.Errorf("invalid category: %s", category)
	}

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate over the rows and build the result
	var tasks []models.ToDoList
	for rows.Next() {
		var task models.ToDoList
		if err := rows.Scan(&task.ID, &task.Task, &task.TaskDetail, &task.Status, &task.CreateAt, &task.TaskTagID); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

// TasksByTagHandler handles the request to get tasks by tag.
func TasksByDateCategoryHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the tag from the query parameters
	category := r.URL.Query().Get("category")
	if category == "" {
		http.Error(w, "Category is required", http.StatusBadRequest)
		return
	}

	// Get the tasks by category (assuming tag corresponds to a category)
	tasks, err := getTasksByDate(db, category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// DeleteTaskHandler handles the request to delete a task by ID.
func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the task ID from the URL query parameters
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	// Delete the task from the database
	query := `DELETE FROM todolist WHERE id = $1`
	result, err := db.Exec(query, taskID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if any row was affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "No task found with the given ID", http.StatusNotFound)
		return
	}

	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Task deleted successfully"})
}

// ToggleTaskStatusHandler handles the request to toggle the status of a task by ID.
func ToggleTaskStatusHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is OPTIONS
	if r.Method == "OPTIONS" {
		// Respond with 200 OK
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the task ID from the URL query parameters
	taskID := r.URL.Query().Get("id")
	if taskID == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	// Get the current status of the task
	currentStatusQuery := `SELECT status FROM todolist WHERE id = $1`
	var currentStatus bool
	err := db.QueryRow(currentStatusQuery, taskID).Scan(&currentStatus)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Toggle the status
	newStatus := !currentStatus

	// Update the task status in the database
	query := `UPDATE todolist SET status = $1 WHERE id = $2`
	_, err = db.Exec(query, newStatus, taskID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("Task status toggled successfully. New status: %v", newStatus)})
}
