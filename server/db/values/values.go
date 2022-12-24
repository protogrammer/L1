package values

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"log"
	"server/db/jsonfield"
)

func NewUserAuth(password string) ([]byte, error) {
	authData := make([]byte, 64)
	_, err := rand.Read(authData[:32])
	if err != nil {
		return nil, err
	}

	hash := sha256.Sum256(append([]byte(password), authData[:32]...))
	copy(authData[32:], hash[:])

	return authData, nil
}

// VerifyAuthData returns true if password is correct
func VerifyAuthData(password string, authData []byte) bool {
	if len(authData) != 64 {
		log.Panicf("incorrect auth data len: expected 64, got %d", len(authData))
	}

	hash := sha256.Sum256(append([]byte(password), authData[:32]...))
	for i, v := range hash {
		if v != authData[32+i] {
			return false
		}
	}
	return true
}

func MetadataGetter(fieldName string, value any) func() map[string]any {
	return func() map[string]any {
		return map[string]any{
			fieldName: value,
		}
	}
}

func ParseUserId(value []byte, getMetadata func() map[string]any) (uint64, error) {
	if len(value) != 8 {
		if getMetadata != nil {
			data, err := json.Marshal(getMetadata())
			if err != nil {
				return 0, fmt.Errorf("invalid user id with len %d: %v, invalid metadata: %v", len(value), value, err)
			}
			return 0, fmt.Errorf("invalid user id with len %d: %v, metadata: %s", len(value), value, string(data))
		}
		return 0, fmt.Errorf("invalid user id with len %d: %v, no metadata", len(value), value)
	}
	return binary.BigEndian.Uint64(value), nil
}

func EmptyUserInfo(username string) ([]byte, error) {
	return json.Marshal(map[string]any{
		jsonfield.Username: username,
	})
}

func UserId(userId uint64) []byte {
	var data [8]byte
	binary.BigEndian.PutUint64(data[:], userId)
	return data[:]
}
