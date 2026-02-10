package backend

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func GetDefaultDownloadPath() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("COULD NOT GET DEFAULT DOWNLOAD PATH")
		return ""
	}

	exportsDir := filepath.Join(homeDir, "/Instaflip Exports")
	os.MkdirAll(exportsDir, os.ModePerm)

	return exportsDir
}

func SelectFolderDialog(ctx context.Context, defaultPath string) (string, error) {
	if defaultPath == "" {
		defaultPath = GetDefaultDownloadPath()
	}

	options := wailsRuntime.OpenDialogOptions{
		Title:            "Select Export Folder",
		DefaultDirectory: defaultPath,
	}

	selectedPath, err := wailsRuntime.OpenDirectoryDialog(ctx, options)
	if err != nil {
		return "", err
	}

	if selectedPath == "" {
		return "", nil
	}

	return selectedPath, nil
}

func Export(startEpoch, endEpoch int64, path string) (bool, error) {
	fmt.Println("Recieved:", startEpoch, endEpoch, path)
	success, err := ExportRange(startEpoch, endEpoch, path)
	return success, err
}
