package main

import (
	"context"
	"hotsak-frontend-server/texas"
	"log/slog"
	"net/http"
)

type userTokenContextKey int

const userTokenContextValue userTokenContextKey = 0

func protectedHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		userToken, ok := texas.GetBearerToken(req)
		if !ok {
			slog.Warn("unauthorized: userToken missing")
			http.Redirect(w, req, "/oauth2/login", http.StatusTemporaryRedirect)
			return
		}
		i, err := texas.IntrospectToken(texas.IdentityProviderEntraId, userToken)
		if err != nil {
			slog.Error("unauthorized: error", "error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if !i.Active {
			slog.Warn("unauthorized: userToken inactive")
			http.Redirect(w, req, "/oauth2/login", http.StatusTemporaryRedirect)
			return
		}
		ctx := context.WithValue(req.Context(), userTokenContextValue, userToken)
		next.ServeHTTP(w, req.WithContext(ctx))
	})
}

func getUserToken(req *http.Request) (token string, ok bool) {
	token, ok = req.Context().Value(userTokenContextValue).(string)
	return
}
