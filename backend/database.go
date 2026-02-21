package backend

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type FlipRow struct {
	ID       int64  `"json:id"`
	EagleID  string `"json:eagle_id"`
	FlipTime int64  `"json:process_time"`
}

type FlipRowItem struct {
	ID       int64  `"json:id"`
	EagleID  string `"json:eagle_id"`
	FlipTime int64  `"json:process_time"`
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

	// v1.2 changes the name of flip_time & decline_time to process_time
	_, err = db.Exec(`ALTER TABLE flips RENAME COLUMN flip_time TO process_time`)
	_, err = db.Exec(`ALTER TABLE declines RENAME COLUMN decline_time TO process_time`)

	// Create flips table.
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS flips (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			eagle_id TEXT NOT NULL,
			process_time INTEGER
		);
	`)
	if err != nil {
		return err
	}

	// Create declines table.
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS declines (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			eagle_id TEXT NOT NULL,
			process_time INTEGER
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
		INSERT INTO flips (eagle_id, process_time)
		VALUES (?, ?)
	`, eagleID, time.Now().UnixMilli())

	return err
}

// Decline patorn by adding a decline instance to the database.
func DeclinePatron(eagleID string) error {
	if db == nil {
		if err := InitDB(); err != nil {
			return nil
		}
	}

	_, err := db.Exec(`
		INSERT INTO declines (eagle_id, process_time)
		VALUES (?, ?)
	`, eagleID, time.Now().UnixMilli())

	fmt.Println("Declined:" + eagleID)

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

func GetRowsOfTable(startEpoch, endEpoch, int64, tables []string) (map[string][]string, error) {
	rowsMap := make(map[string][]string)

	for _, table := range tables {
		rows, err := db.Query(`
			SELECT * FROM ?
			WHERE process_time >= ? and process_time
			// make function that gets rows.
		`)
		if err != nil {
			return nil, err
		}

		var tableRows []string
		for rows.Next() {
			var row string
			err := rows.Scan(&row)
			if err != nil {
				return nil, err
			}
			tableRows = append(tableRows, row)
		}

		rowsMap[table] = tableRows
		rows.Close()
	}

	return rowsMap, nil
}

// Get data with epoch range.
func ExportRange(start int64, end int64, path string) (bool, error) {
	if db == nil {
		if err := InitDB(); err != nil {
			return false, err
		}
	}

	rows, err := db.Query(`
		SELECT *
		FROM flips
		WHERE process_time >= ? AND process_time <= ?
	`, start, end)
	if err != nil {
		return false, err
	}
	defer rows.Close()

	now := time.Now().Format("2006-01-02_15-04-05")
	fullPath := filepath.Join(path, "instaflip-export_"+now+".csv")
	file, err := os.Create(fullPath)
	if err != nil {
		return false, err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"id", "eagle_id", "process_time"})

	for rows.Next() {
		var flip FlipRowItem

		if err := rows.Scan(&flip.ID, &flip.EagleID, &flip.FlipTime); err != nil {
			return false, err
		}

		writer.Write([]string{
			strconv.FormatInt(flip.ID, 10),
			flip.EagleID,
			strconv.FormatInt(flip.FlipTime, 10),
		})
	}

	if err := rows.Err(); err != nil {
		return false, err
	}

	return true, nil
}

func DeleteFlip(eagleID string, date int64) (bool, error) {
	if db == nil {
		if err := InitDB(); err != nil {
			return false, err
		}
	}

	_, err := db.Exec(`
	DELETE FROM flips
	WHERE eagle_id = ? AND process_time = ?
	`, eagleID, date)

	if err != nil {
		return false, err
	}

	return true, nil
}

func SaveLogs(logs string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "."
	}

	path := filepath.Join(homeDir, ".instaflip", "logs")
	// Create directory if it does not already exist.
	if err := os.MkdirAll(path, 0755); err != nil {
		fmt.Println("error: ", err)
		return err
	}

	now := time.Now().Format("2006-01-02_15-04-05")
	fullPath := filepath.Join(path, "instaflip-log_"+now+".txt")
	return os.WriteFile(fullPath, []byte(logs), 0644)
}
