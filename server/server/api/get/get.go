package get

import (
	"github.com/gin-gonic/gin"
	"server/db"
	"server/server/shared/retcommand"
	"server/server/shared/reterror"
	"server/shared/consts"
	"server/utils"
)

func UsernameTaken(c *gin.Context) {
	username := c.Request.URL.Query().Get(consts.ParamUsername)
	if !utils.UsernameIsValid(username) {
		reterror.InvalidUsernameOrPassword(c)
		return
	}

	retcommand.Data(c, db.CheckUsernameTaken(username))
}
