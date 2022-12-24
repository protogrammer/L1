package db

import "errors"

var (
	ErrorUsernameTaken     = errors.New("ErrorUsernameTaken")
	ErrorUserNotFound      = errors.New("ErrorUserNotFound")
	ErrorIncorrectPassword = errors.New("ErrorIncorrectPassword")
)
