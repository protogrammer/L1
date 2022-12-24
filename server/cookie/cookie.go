package cookie

import (
	"crypto/rand"
	"encoding/base64"
	"sync"
	"time"
)

const (
	SessionDuration = 3 * time.Hour
)

type cookieInfo struct {
	token   string
	expires time.Time
}

var cookies sync.Map
var cookiesChan = make(chan cookieInfo, 100)

func init() {
	go watchCookieExpiration()
}

func watchCookieExpiration() {
	var cookiesList []cookieInfo
	for {
		if len(cookiesList) == 0 {
			cookie := <-cookiesChan
			cookiesList = append(cookiesList, cookie)
		} else {
			select {
			case cookie := <-cookiesChan:
				cookiesList = append(cookiesList, cookie)
			case <-time.After(time.Until(cookiesList[0].expires)):
				cookies.Delete(cookiesList[0].token)
				cookiesList = cookiesList[1:]
			}
		}
	}
}

const tokenByteSize = 32

func NewToken(username string) (token string, expires time.Time, err error) {
	data := make([]byte, tokenByteSize)

	_, err = rand.Read(data)
	if err != nil {
		return "", time.Time{}, err
	}

	token = base64.RawURLEncoding.EncodeToString(data)
	_, loaded := cookies.LoadOrStore(token, username)
	if loaded {
		return NewToken(username)
	}

	expires = time.Now().Add(SessionDuration)

	cookiesChan <- cookieInfo{
		token:   token,
		expires: expires,
	}

	return
}

func Delete(token string) {
	cookies.Delete(token)
}

func GetUsername(token string) (string, bool) {
	value, ok := cookies.Load(token)
	if !ok {
		return "", false
	}
	return value.(string), true
}
