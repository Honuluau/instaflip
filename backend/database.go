package backend

import (
	"os"
	"path/filepath"
)

func GetDBPath() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "."
	}

	return filepath.Join(homeDir, ".instaflip", "flips.db")
}
