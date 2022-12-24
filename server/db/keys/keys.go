package keys

import (
	"encoding/binary"
	"server/db/prefix"
)

func userIdWithPrefix(userId uint64, pref byte) []byte {
	var data [9]byte
	data[0] = pref
	binary.BigEndian.PutUint64(data[1:], userId)
	return data[:]
}

func UserAuth(userId uint64) []byte {
	return userIdWithPrefix(userId, prefix.UserAuth)
}

func UserInfo(userId uint64) []byte {
	return userIdWithPrefix(userId, prefix.UserInfo)
}

func Username(username string) []byte {
	return append([]byte{prefix.Username}, []byte(username)...)
}
