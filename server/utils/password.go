package utils

import (
	"encoding/base64"
	"sort"
)

const (
	MinPasswordLength          = 8
	MinUniqueSymbolsInPassword = 5
)

func PasswordIsStrong(password string) bool {
	a := []rune(password)
	if len(a) < MinPasswordLength {
		return false
	}
	sort.Slice(a, func(i, j int) bool {
		return a[i] < a[j]
	})
	acc := 1
	for i := 1; i < len(a); i++ {
		if a[i-1] != a[i] {
			acc++
		}
	}
	return acc >= MinUniqueSymbolsInPassword
}

func PasswordFromUrlEncoding(passUrl string) (string, error) {
	p, err := base64.URLEncoding.DecodeString(passUrl)
	return string(p), err
}
