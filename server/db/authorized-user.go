package db

import (
	"errors"
	"github.com/dgraph-io/badger/v3"
	"server/db/keys"
	"server/db/prefix"
	"server/db/values"
)

type AuthorizedUser struct {
	*User
}

func NewUser(username string, password string) (*AuthorizedUser, error) {
	userAuthValue, err := values.NewUserAuth(password)
	if err != nil {
		return nil, err
	}

	userInfoValue, err := values.EmptyUserInfo(username)
	if err != nil {
		return nil, err
	}
	var userId uint64
	usernameKey := keys.Username(username)

	err = db.Update(func(txn *badger.Txn) error {
		if _, err := txn.Get(usernameKey); err == nil {
			return ErrorUsernameTaken
		}

		userIdItem, err := txn.Get([]byte{prefix.UserCount})
		if err != nil {
			return err
		}

		var userIdBytes [8]byte
		if _, err := userIdItem.ValueCopy(userIdBytes[:]); err != nil {
			return err
		}

		userId, err = values.ParseUserId(userIdBytes[:], nil)

		newUserCountBytes := values.UserId(userId + 1)
		if err := txn.Set([]byte{prefix.UserCount}, newUserCountBytes); err != nil {
			return err
		}

		if err := txn.Set(usernameKey, userIdBytes[:]); err != nil {
			return err
		}

		userIdKey := keys.UserAuth(userId)
		if err := txn.Set(userIdKey, userAuthValue); err != nil {
			return err
		}

		return txn.Set(keys.UserInfo(userId), userInfoValue)
	})

	if err != nil {
		return nil, err
	}

	return &AuthorizedUser{
		User: &User{
			id:       userId,
			username: username,
		},
	}, nil
}

func ChangePassword(userId uint64, oldPassword, newPassword string) (*AuthorizedUser, error) {
	key := keys.UserAuth(userId)

	newAuthData, err := values.NewUserAuth(newPassword)
	if err != nil {
		return nil, err
	}

	err = db.Update(func(txn *badger.Txn) error {
		item, err := txn.Get(key)
		if err != nil {
			if errors.Is(err, badger.ErrKeyNotFound) {
				return ErrorUserNotFound
			}
			return err
		}
		return item.Value(func(oldAuthData []byte) error {
			if !values.VerifyAuthData(oldPassword, oldAuthData) {
				return ErrorIncorrectPassword
			}
			return txn.Set(key, newAuthData)
		})
	})

	if err != nil {
		return nil, err
	}

	return &AuthorizedUser{
		User: &User{
			id: userId,
		},
	}, nil
}
