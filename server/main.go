package main

import (
	"fmt"
	"log"
	"net/http"

	_ "github.com/deepaks2293/go-todo/middleware" // Import for side effects only
	"github.com/deepaks2293/go-todo/router"
)

func main() {
	// The init() function from middleware package will be automatically called
	// when the package is imported, establishing a connection to PostgreSQL.

	// Now you can continue with your application logic.
	r := router.Router()
	fmt.Println("Starting server on the port 8080...")
	log.Fatal(http.ListenAndServe(":8080", r))
}
