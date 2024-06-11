package models

import "time"

// TaskTag model
type TaskTag struct {
	ID   string `json:"id,omitempty" bson:"_id,omitempty"`
	Name string `json:"name,omitempty" bson:"name,omitempty"`
}

// ToDoList model
type ToDoList struct {
	ID         string `json:"id,omitempty"`
	Task       string `json:"task,omitempty"`
	TaskDetail string `json:"taskDetail,omitempty"`
	Status     bool   `json:"status,omitempty"`
	CreateAt   string `json:"createAt,omitempty"` // Store as string in YYYY-MM-DD format
	TaskTagID  string `json:"taskTagId,omitempty"`
}

// Helper function to format the date as YYYY-MM-DD
func FormatDate(t time.Time) string {
	return t.Format("2006-01-02")
}
