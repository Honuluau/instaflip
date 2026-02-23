package main

import (
	"context"
	"fmt"
	"instaflip/backend"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Init DB
	backend.InitDB()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Flip Patron to Database
func (a *App) FlipPatronDB(eagle_id string) error {
	return backend.FlipPatron(eagle_id)
}

// Check Patron for Flips
func (a *App) CheckFlipsDB(eagle_id string) (flips []backend.FlipRowItem, err error) {
	return backend.CheckFlips(eagle_id)
}

// Decline Patron
func (a *App) DeclinePatronDB(eagleID string) error {
	return backend.DeclinePatron(eagleID)
}

// Select Folder
func (a *App) SelectFolder(defaultPath string) (string, error) {
	return backend.SelectFolderDialog(a.ctx, defaultPath)
}

// On Export
func (a *App) ExportStatistics(startEpoch, endEpoch int64, path, style, fileType string, tables []string) (bool, error) {
	success, err := backend.Export(startEpoch, endEpoch, path, style, fileType, tables)
	return success, err
}

// Delete Flip
func (a *App) DeleteFlip(eagleID string, date int64) (bool, error) {
	success, err := backend.DeleteFlip(eagleID, date)
	return success, err
}

// Save Logs
func (a *App) SaveLogs(logs string) error {
	return backend.SaveLogs(logs)
}

// Check Version
func (a *App) CheckVersion() (string, error) {
	return backend.CheckVersion()
}
