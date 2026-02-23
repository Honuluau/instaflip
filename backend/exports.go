package backend

import (
	"context"
	"encoding/csv"
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

func GenerateFileName() string {
	now := time.Now().Format("2006-01-02_15-04-05")
	return "InstaFlip Export (" + now + ")"
}

func GetExportPath(path, fileExtension string) string {
	return filepath.Join(path, GenerateFileName()+"."+fileExtension)
}

func ConvertUnixMillisecondsToDateString(unixMilliseconds int64) string {
	t := time.UnixMilli(unixMilliseconds)
	return t.Format("2006-01-02")
}

func ConvertUnixMillisecondsToTimestamp(unixMilliseconds int64) string {
	t := time.UnixMilli(unixMilliseconds)
	return t.Format("2006-01-02 15:04:05 MST")
}

func CreateNewSheetOrOverwriteExisting(table string, f *excelize.File) error {
	index, err := f.GetSheetIndex(table)
	if err != nil {
		fmt.Println(err)
		return err
	}

	// Create new or overwrite existing sheet and set to active.
	if index != -1 {
		f.SetActiveSheet(index)
	} else {
		index, err := f.NewSheet(table)
		if err != nil {
			fmt.Println(err)
			return err
		}
		f.SetActiveSheet(index)
	}

	return nil
}

func WriteUnixMillisecondsXLSX(table string, rows []FlipRowItem, f *excelize.File) bool {
	err := CreateNewSheetOrOverwriteExisting(table, f)
	if err != nil {
		fmt.Println(err)
		return false
	}

	// Set headers
	f.SetCellValue(table, "A1", "InstaFlip Id")
	f.SetCellValue(table, "B1", "Eagle Id")
	f.SetCellValue(table, "C1", "Unix Millisecond")

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

func WriteDatetimeXLSX(table string, rows []FlipRowItem, f *excelize.File) error {
	err := CreateNewSheetOrOverwriteExisting(table, f)
	if err != nil {
		fmt.Println(err)
		return err
	}

	// Set Headers
	f.SetCellValue(table, "A1", "InstaFlip Id")
	f.SetCellValue(table, "B1", "Eagle Id")
	f.SetCellValue(table, "C1", "Datetime")

	// Paste Data
	for index, row := range rows {
		f.SetCellValue(table, "A"+strconv.Itoa(index+2), row.ID)
		f.SetCellValue(table, "B"+strconv.Itoa(index+2), row.EagleID)
		f.SetCellValue(table, "C"+strconv.Itoa(index+2), ConvertUnixMillisecondsToTimestamp(row.FlipTime))
	}

	f.SetColWidth(table, "B", "B", 16)
	f.SetColWidth(table, "C", "C", 30)

	return nil
}

func WriteYearMonthTimestampXLSX(table string, rows []FlipRowItem, f *excelize.File) error {
	err := CreateNewSheetOrOverwriteExisting(table, f)
	if err != nil {
		fmt.Println(err)
		return err
	}

	// Set Headers
	f.SetCellValue(table, "A1", "InstaFlip Id")
	f.SetCellValue(table, "B1", "Eagle Id")
	f.SetCellValue(table, "C1", "Year")
	f.SetCellValue(table, "D1", "Month")
	f.SetCellValue(table, "E1", "Timestamp")

	// Paste Data
	for index, row := range rows {
		f.SetCellValue(table, "A"+strconv.Itoa(index+2), row.ID)
		f.SetCellValue(table, "B"+strconv.Itoa(index+2), row.EagleID)

		t := time.UnixMilli(row.FlipTime)
		f.SetCellValue(table, "C"+strconv.Itoa(index+2), t.Year())
		f.SetCellValue(table, "D"+strconv.Itoa(index+2), t.Month())

		f.SetCellValue(table, "E"+strconv.Itoa(index+2), ConvertUnixMillisecondsToTimestamp(row.FlipTime))
	}

	f.SetColWidth(table, "B", "B", 16)
	f.SetColWidth(table, "C", "C", 6)
	f.SetColWidth(table, "D", "D", 12)
	f.SetColWidth(table, "E", "E", 30)

	return nil
}

func ExportXLSX(startEpoch, endEpoch int64, path, style string, tables []string) (bool, error) {
	rows, _ := GetRowsOfTable(startEpoch, endEpoch, tables)

	// Create a new Excel File
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	// Initialize the first Sheet with the first index of tables. The write functions should overwrite data here.
	f.SetSheetName("Sheet1", tables[0])

	switch style {
	case "Unix Milliseconds":
		for _, table := range tables {
			WriteUnixMillisecondsXLSX(table, rows[table], f)
		}
	case "Datetime":
		for _, table := range tables {
			WriteDatetimeXLSX(table, rows[table], f)
		}
	case "Year, Month, & Timestamp":
		for _, table := range tables {
			WriteYearMonthTimestampXLSX(table, rows[table], f)
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
	if err := f.SaveAs(GetExportPath(path, "xlsx")); err != nil {
		fmt.Println(err)
		return false, nil
	}

	return false, nil
}

func WriteUnixMillisecondsCSV(file *os.File, rows []FlipRowItem, table string) {
	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"InstaFlip Id", "Eagle Id", "Unix Millisecond (" + table + ")"})

	for _, row := range rows {
		writer.Write([]string{
			strconv.FormatInt(row.ID, 10),
			row.EagleID,
			strconv.FormatInt(row.FlipTime, 10),
		})
	}
}

func WriteDatetimeCSV(file *os.File, rows []FlipRowItem, table string) {
	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"InstaFlip Id", "Eagle Id", "Datetime (" + table + ")"})

	for _, row := range rows {
		writer.Write([]string{
			strconv.FormatInt(row.ID, 10),
			row.EagleID,
			ConvertUnixMillisecondsToDateString(row.FlipTime),
		})
	}
}

func WriteYearMonthTimestampCSV(file *os.File, rows []FlipRowItem, table string) {
	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{"InstaFlip Id", "Eagle Id", "Year", "Month", "Timestamp (" + table + ")"})

	for _, row := range rows {
		t := time.UnixMilli(row.FlipTime)

		writer.Write([]string{
			strconv.FormatInt(row.ID, 10),
			row.EagleID,
			strconv.Itoa(t.Year()),
			t.Month().String(),
			ConvertUnixMillisecondsToTimestamp(row.FlipTime),
		})
	}
}

func ExportCSV(startEpoch, endEpoch int64, path, style, table string) {
	tables := []string{table}
	rows, err := GetRowsOfTable(startEpoch, endEpoch, tables)
	if err != nil {
		fmt.Println(err)
	}

	fullPath := GetExportPath(path, "csv")
	file, err := os.Create(fullPath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	switch style {
	case "Unix Milliseconds":
		WriteUnixMillisecondsCSV(file, rows[table], table)
	case "Datetime":
		WriteDatetimeCSV(file, rows[table], table)
	case "Year, Month, & Timestamp":
		WriteYearMonthTimestampCSV(file, rows[table], table)
	}

	return
}

func Export(startEpoch, endEpoch int64, path, style, fileType string, tables []string) (bool, error) {
	switch fileType {
	case "xlsx":
		ExportXLSX(startEpoch, endEpoch, path, style, tables)
	case "csv":
		ExportCSV(startEpoch, endEpoch, path, style, tables[0])
	}

	return true, nil
}
