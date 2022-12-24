package db

import (
	"errors"
	"fmt"
	"github.com/dgraph-io/badger/v3"
	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
	"server/db/jsonfield"
	"server/db/keys"
	"server/db/values"
	"server/shared/consts"
	"sync"
)

// User not copyable
type User struct {
	m        sync.RWMutex
	id       uint64 // readonly
	username string
}

func (user *User) Username() string {
	user.m.RLock()
	if len(user.username) == 0 {
		user.m.RUnlock()
		user.m.Lock()
		defer user.m.Unlock()
		if len(user.username) != 0 {
			return user.username
		}
		err := db.View(func(txn *badger.Txn) error {
			item, err := txn.Get(keys.UserInfo(user.id))
			if err != nil {
				return err
			}
			return item.Value(func(value []byte) error {
				res := gjson.GetBytes(value, jsonfield.Username)
				if username := res.String(); len(username) != 0 {
					user.username = username
					return nil
				}
				return fmt.Errorf("no username in user info, id=%d", user.id)
			})
		})
		if err != nil {
			panic(err)
		}
	} else {
		defer user.m.RUnlock()
	}
	return user.username
}

func (user *User) Id() uint64 {
	return user.id
}

func (user *User) H() gin.H {
	return gin.H{
		consts.DataUserId:   user.id,
		consts.DataUsername: user.Username(),
	}
}

func (user *User) Authorize(password string) (*AuthorizedUser, error) {
	key := keys.UserAuth(user.id)
	authData := make([]byte, 64)

	err := db.View(func(txn *badger.Txn) error {
		item, err := txn.Get(key)
		if err != nil {
			if errors.Is(err, badger.ErrKeyNotFound) {
				return ErrorUserNotFound
			}
			return err
		}

		_, err = item.ValueCopy(authData)

		return err
	})

	if err != nil {
		return nil, err
	}

	if values.VerifyAuthData(password, authData) {
		return &AuthorizedUser{
			User: user,
		}, nil
	}

	return nil, ErrorIncorrectPassword
}

func CheckUsernameTaken(username string) bool {
	key := keys.Username(username)
	err := db.View(func(txn *badger.Txn) error {
		_, err := txn.Get(key)
		return err
	})
	return err == nil
}

func GetUser(username string) (*User, error) {
	var userId uint64

	key := keys.Username(username)

	metadataGetter := values.MetadataGetter("username", username)
	err := db.View(func(txn *badger.Txn) error {
		item, err := txn.Get(key)
		if err != nil {
			return err
		}

		return item.Value(func(value []byte) error {
			var err error
			userId, err = values.ParseUserId(value, metadataGetter)
			return err
		})
	})

	if err != nil {
		if errors.Is(err, badger.ErrKeyNotFound) {
			return nil, ErrorUserNotFound
		}
		return nil, err
	}

	return &User{
		id:       userId,
		username: username,
	}, nil
}
