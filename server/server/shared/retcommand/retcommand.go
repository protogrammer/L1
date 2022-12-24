package retcommand

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"server/shared/consts"
)

func Success(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		consts.Command: consts.CommandSuccess,
	})
}

func NotFound(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		consts.Command: consts.CommandNotFound,
	})
}

func Deny(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		consts.Command: consts.CommandDeny,
	})
}

func Data[T any](c *gin.Context, data T) {
	c.JSON(http.StatusOK, gin.H{
		consts.Command: consts.CommandSuccess,
		consts.Data:    data,
	})
}
