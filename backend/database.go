package backend

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

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
			flip_time DATETIME
		);
	`)
	if err != nil {
		print(err.Error())
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
