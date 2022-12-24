package server

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"log"
	"server/env"
	"server/server/api/get"
	"server/server/api/post"
	"server/server/relpath"
	"server/server/shared/reterror"
	"strings"
)

var router *gin.Engine

func init() {
	router = gin.Default()
	err := router.SetTrustedProxies(nil)
	if err != nil {
		log.Panicln("[server]", err)
	}

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	fs := static.LocalFile(env.ReactBuildDirectory(), true)

	router.Use(static.Serve(relpath.Global, fs))

	router.POST(relpath.ApiNewUser, post.NewUser)
	router.POST(relpath.ApiChangePassword, post.ChangePassword)
	router.POST(relpath.ApiLogin, post.Login)
	router.POST(relpath.ApiLogout, post.Logout)
	router.GET(relpath.ApiUsernameTaken, get.UsernameTaken)
	router.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, relpath.Api) {
			reterror.PathNotFound(c)
			return
		}

		c.FileFromFS("", fs)
	})
}

func Run() {
	if err := router.Run(":" + env.Port()); err != nil {
		log.Println("[server] listen:", err)
	}
}
