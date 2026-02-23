package backend

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/xuri/excelize/v2"

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

func ExportCSV(startEpoch, endEpoch int64, path, table string) (bool, error) {
	// Get rows, write to csv.
	return false, nil
}

func ConvertUnixMillisecondsToDateString(unixMilliseconds int64) string {
	t := time.UnixMilli(unixMilliseconds)
	return t.Format("2006-01-02")
}

func WriteUnixMillisecondsXLSX(table string, rows []FlipRowItem, f *excelize.File) bool {
	index, err := f.GetSheetIndex(table)
	if err != nil {
		fmt.Println(err)
	}

	// Create new or overwrite existing sheet and set to active.
	if index != -1 {
		f.SetActiveSheet(index)
	} else {
		index, err := f.NewSheet(table)
		if err != nil {
			fmt.Println(err)
		}
		f.SetActiveSheet(index)
	}

	// Set headers
	f.SetCellValue(table, "A1", "InstaFlip Id")
	f.SetCellValue(table, "B1", "Eagle Id")
	f.SetCellValue(table, "C1", "Unix Milliseconds")

	// Paste Data
	for index, row := range rows {
		f.SetCellValue(table, "A"+strconv.Itoa(index+2), row.ID)
		f.SetCellValue(table, "B"+strconv.Itoa(index+2), row.EagleID)
		f.SetCellValue(table, "C"+strconv.Itoa(index+2), row.FlipTime)
	}

	// Set Unix Column to number
	sty, err := f.NewStyle(&excelize.Style{
		NumFmt: 1,
	})
	if err != nil {
		fmt.Println(err)
	}

	f.SetColStyle(table, "A:C", sty)
	f.SetColWidth(table, "B", "B", 16)
	f.SetColWidth(table, "C", "C", 16)

	return true
}

func ExportXLSX(startEpoch, endEpoch int64, path, style string, tables []string) (bool, error) {
	rows, _ := GetRowsOfTable(startEpoch, endEpoch, tables)
	fmt.Println(rows)
	fmt.Println(rows["declines"][0])
	// Returns dictionary of tables with rows of FlipRowItems
	// Just find a way to export the data now.

	// Create a new Excel File
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	// Initialize the first Sheet with the first index of tables. The write functions should overwrite data here.
	f.SetSheetName("Sheet1", tables[0])

	if style == "Unix Milliseconds" {
		for _, table := range tables {
			WriteUnixMillisecondsXLSX(table, rows[table], f)
		}
	}

	// Add information sheet
	_, err := f.NewSheet("info")
	if err != nil {
		fmt.Println(err)
	}

	f.SetCellValue("info", "A1", "Start Date:")
	f.SetCellValue("info", "A2", "End Date:")
	f.SetCellValue("info", "A3", "Generated:")

	f.SetCellValue("info", "B1", ConvertUnixMillisecondsToDateString(startEpoch))
	f.SetCellValue("info", "B2", ConvertUnixMillisecondsToDateString(endEpoch))
	f.SetCellValue("info", "B3", ConvertUnixMillisecondsToDateString(time.Now().UnixMilli()))
	f.SetColWidth("info", "A", "B", 16)

	f.SetActiveSheet(0)
	if err := f.SaveAs(filepath.Join(path, "InstaFlip.xlsx")); err != nil {
		fmt.Println(err)
		return false, nil
	}

	return false, nil
}

func Export(startEpoch, endEpoch int64, path, style, fileType string, tables []string) (bool, error) {
	if len(tables) == 1 {
		// Export 1 table as either a .csv or an .xlsx
		ExportCSV(startEpoch, endEpoch, path, tables[0])
	} else {
		// It is impossible to have 0 tables, therefore everything exported here will be separate .xlsx sheets.
		ExportXLSX(startEpoch, endEpoch, path, style, tables)
	}
	fmt.Println("Recieved:", startEpoch, endEpoch, path)
	success, err := ExportRange(startEpoch, endEpoch, path)
	return success, err
}
