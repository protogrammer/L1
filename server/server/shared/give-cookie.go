package shared

import (
	"github.com/gin-gonic/gin"
	"server/cookie"
	"server/db"
	"server/env"
	"server/server/shared/reterror"
	"server/shared/consts"
	"time"
)

func GiveCookie(c *gin.Context, authorized *db.AuthorizedUser) {
	token, _, err := cookie.NewToken(authorized.Username())
	reterror.PanicInternal(c, err)

	c.SetCookie(consts.CookieSessionId, token, int(cookie.SessionDuration/time.Second), "/", env.Domain(), false, true)
}
