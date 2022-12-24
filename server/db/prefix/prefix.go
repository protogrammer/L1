package prefix

const (
	// UserCount ==> uint64
	UserCount byte = iota

	// UserAuth user-id uint64 ==> 32 byte salt + 32 byte SHA-256 checksum
	UserAuth

	// Username username string ==> user-id uint64
	Username

	// UserInfo user-id uint64 ==> json { username string }
	UserInfo
)
