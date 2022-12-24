package reterror

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"server/shared/consts"
)

func PanicInternal(c *gin.Context, err error) {
	if err == nil {
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{
		consts.Error: consts.ErrorUnknown,
	})
	panic(err)
}

func InvalidUsernameOrPassword(c *gin.Context) {
	c.JSON(http.StatusPreconditionFailed, gin.H{
		consts.Error: consts.ErrorInvalidUsernameOrPassword,
	})
}

func PathNotFound(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		consts.Error: consts.ErrorPathNotFound,
	})
}

func NoSessionId(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		consts.Error: consts.ErrorNoSessionId,
	})
}

func InvalidSessionId(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		consts.Error: consts.ErrorInvalidSessionId,
	})
}
