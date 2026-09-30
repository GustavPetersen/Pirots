package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"

	"github.com/GustavPetersen/Pirots/backend/db"
)

const boardSize = 6 * 6
const characterCount = 4
var characterColors [characterCount] string
type CharacterLocation struct {
	Color string
	Location int
}

func main() {
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	// Run migrations on startup
	goose.SetBaseFS(db.Migrations)
	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal(err)
	}
	if err := goose.Up(stdlib.OpenDBFromPool(pool), "migrations"); err != nil {
		log.Fatal(err)
	}

	r := chi.NewRouter()
	r.Use(middleware.RealIP, middleware.Logger, middleware.Recoverer)

	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"ok":true}`))
	})

	r.Get("/api/diamonds", func(w http.ResponseWriter, r *http.Request) {
		var diamonds [boardSize]int

		for i := range boardSize {
			diamonds[i] = rand.IntN(4)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		json.NewEncoder(w).Encode(diamonds)
	})

	r.Get("/api/prisoners/getStartingLocation", func(w http.ResponseWriter, r *http.Request) {
		var characterStartingPos [4] CharacterLocation
		// players[1] = CharacterLocation{"a", 2}
		var takenLocations [4] int

		for i := 0; i < len(characterStartingPos); i++ {
			var location = rand.IntN(boardSize)

			// dette er et while loop men while er cursed i Go
			for j := 0; j < len(takenLocations); j++ {
				if takenLocations[j] == location {
					location = rand.IntN(boardSize)
					j = -1
				} 
			}

			characterStartingPos[i] = CharacterLocation{characterColors[i], location}
			fmt.Println("Character " + characterColors[i] + " in location " + strconv.Itoa(location))
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		json.NewEncoder(w).Encode(characterStartingPos)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
