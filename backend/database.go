package backend

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type FlipRow struct {
	ID       int64  `"json:id"`
	EagleID  string `"json:eagle_id"`
	FlipTime int64  `"json:flip_time"`
}

type FlipRowItem struct {
	ID       int64  `"json:id"`
	EagleID  string `"json:eagle_id"`
	FlipTime int64  `"json:flip_time"`
}

var db *sql.DB

func GetDBPath() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "."
	}

	return filepath.Join(homeDir, ".instaflip", "instaflip.db")
}

func InitDB() error {
	dbPath := GetDBPath()

	// Create directory if it does not already exist.
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	var err error
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return err
	}

	// Create flips table.
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS flips (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			eagle_id TEXT NOT NULL,
			flip_time INTEGER
		);
	`)
	if err != nil {
		return err
	}

	return nil
}

// Close DB Connection

func CloseDB() {
	if db != nil {
		db.Close()
	}
}

// Flip patron by adding a flip instance to the database.
func FlipPatron(eagleID string) error {
	if db == nil {
		if err := InitDB(); err != nil {
			return nil
		}
	}

	_, err := db.Exec(`
		INSERT INTO flips (eagle_id, flip_time)
		VALUES (?, ?)
	`, eagleID, time.Now().UnixMilli())

	return err
}

// Return all flips with given eagle id.
func CheckFlips(eagleID string) (flips []FlipRowItem, err error) {
	if db == nil {
		if err := InitDB(); err != nil {
			return nil, err
		}
	}

	rows, err := db.Query(`
		SELECT *
		FROM flips
		WHERE eagle_id = ?
	`, eagleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var flip FlipRowItem
		var flipTime int64

		if err := rows.Scan(&flip.ID, &flip.EagleID, &flipTime); err != nil {
			continue
		}
		flip.FlipTime = flipTime

		flips = append(flips, flip)
	}

	fmt.Println("Flips:", flips)

	return flips, err
}
