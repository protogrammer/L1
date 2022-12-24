package post

import (
	"errors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"server/cookie"
	"server/db"
	"server/env"
	"server/server/shared"
	"server/server/shared/retcommand"
	"server/server/shared/reterror"
	"server/shared/consts"
	"server/utils"
	"strconv"
)

func NewUser(c *gin.Context) {
	username := c.Request.URL.Query().Get(consts.ParamUsername)
	password := c.Request.URL.Query().Get(consts.ParamPassword)

	log.Println(username, password)
	log.Println(utils.UsernameIsValid(username), utils.PasswordIsStrong(password))

	if !utils.UsernameIsValid(username) || !utils.PasswordIsStrong(password) {
		reterror.InvalidUsernameOrPassword(c)
		return
	}

	authorized, err := db.NewUser(username, password)
	if err != nil {
		if errors.Is(err, db.ErrorUsernameTaken) {
			retcommand.Deny(c)
			return
		}
		reterror.PanicInternal(c, err)
	}

	shared.GiveCookie(c, authorized)
	retcommand.Data(c, authorized.H())
}

func ChangePassword(c *gin.Context) {
	token, err := c.Cookie(consts.CookieSessionId)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			reterror.NoSessionId(c)
			return
		}

		reterror.PanicInternal(c, err)
	}

	_, ok := cookie.GetUsername(token)
	if !ok {
		reterror.InvalidSessionId(c)
		return
	}

	password := c.Request.URL.Query().Get(consts.ParamPassword)
	newPassword := c.Request.URL.Query().Get(consts.ParamNewPassword)
	userIdString := c.Request.URL.Query().Get(consts.ParamUserId)
	userId, err := strconv.ParseUint(userIdString, 10, 64)
	if err != nil {
		retcommand.NotFound(c)
		return
	}

	if !utils.PasswordIsStrong(password) || !utils.PasswordIsStrong(newPassword) {
		reterror.InvalidUsernameOrPassword(c)
		return
	}

	authorized, err := db.ChangePassword(userId, password, newPassword)
	if err != nil {
		if errors.Is(err, db.ErrorUserNotFound) {
			retcommand.NotFound(c)
			return
		}

		if errors.Is(err, db.ErrorIncorrectPassword) {
			retcommand.NotFound(c)
			return
		}

		reterror.PanicInternal(c, err)
	}

	cookie.Delete(token)
	shared.GiveCookie(c, authorized)
	retcommand.Success(c)
}

func Login(c *gin.Context) {
	username := c.Request.URL.Query().Get(consts.ParamUsername)
	password := c.Request.URL.Query().Get(consts.ParamPassword)

	if !utils.UsernameIsValid(username) || !utils.PasswordIsStrong(password) {
		reterror.InvalidUsernameOrPassword(c)
		return
	}

	user, err := db.GetUser(username)
	if err != nil {
		if errors.Is(err, db.ErrorUserNotFound) {
			retcommand.NotFound(c)
			return
		}
		reterror.PanicInternal(c, err)
	}

	authorized, err := user.Authorize(password)
	if err != nil {
		if errors.Is(err, db.ErrorIncorrectPassword) {
			retcommand.NotFound(c)
			return
		}
		reterror.PanicInternal(c, err)
	}

	shared.GiveCookie(c, authorized)
	retcommand.Data(c, authorized.H())
}

func Logout(c *gin.Context) {
	token, err := c.Cookie(consts.CookieSessionId)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			reterror.NoSessionId(c)
			return
		}

		reterror.PanicInternal(c, err)
	}

	if _, ok := cookie.GetUsername(token); !ok {
		reterror.NoSessionId(c)
		return
	}

	cookie.Delete(token)
	c.SetCookie(consts.CookieSessionId, "", -1, "/", env.Domain(), false, true)
	retcommand.Success(c)
}
