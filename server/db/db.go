package db

import (
	"github.com/dgraph-io/badger/v3"
	"log"
	"server/db/prefix"
	"server/db/values"
	"server/env"
)

var db *badger.DB

func init() {
	var err error
	if db, err = badger.Open(badger.DefaultOptions(env.DatabaseDirectory())); err != nil {
		panic(err)
	}
	err = db.Update(func(txn *badger.Txn) error {
		if _, err := txn.Get([]byte{prefix.UserCount}); err != badger.ErrKeyNotFound {
			return err
		}
		if err := txn.Set([]byte{prefix.UserCount}, values.UserId(0)); err != nil {
			return err
		}
		log.Print("[db] created field UserCount")
		return nil
	})
	if err != nil {
		panic(err)
	}
}

func Close() {
	if err := db.Close(); err != nil {
		log.Println("[db] close error:", err)
	}
}
