package backend

import (
	"encoding/json"
	"net/http"
	"strings"
)

type Tag struct {
	Name string `json:"name"`
}

func CheckVersion() (string, error) {
	url := "https://api.github.com/repos/Honuluau/instaflip/tags"
	reader := strings.NewReader(`{"body":123}`)
	request, err := http.NewRequest("GET", url, reader)
	if err != nil {
		return "", err
	}

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}

	var tags []Tag
	if err := json.NewDecoder(response.Body).Decode(&tags); err != nil {
		return "", nil
	}

	return tags[0].Name, nil
}
