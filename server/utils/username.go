package utils

import (
	"fmt"
	"regexp"
)

const (
	MinUsernameLength = 5
	MaxUsernameLength = 30
)

var usernameRegex = regexp.MustCompile(fmt.Sprintf(`([a-z]|.|_)(\d|[a-z]|.|_){%d,%d}`,
	MinUsernameLength-1, MaxUsernameLength-1))

func UsernameIsValid(username string) bool {
	return len(username) != 0 && usernameRegex.FindString(username) == username
}
