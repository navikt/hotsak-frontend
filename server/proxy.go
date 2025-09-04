package main

import (
	"fmt"
	"hotsak-frontend-server/texas"
	"log/slog"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

type proxyTarget struct {
	Target           *url.URL               `json:"target"`
	StripPrefix      bool                   `json:"stripPrefix"`
	IdentityProvider texas.IdentityProvider `json:"identityProvider"`
	Scope            string                 `json:"scope"`
}

func (t *proxyTarget) handler(prefix string) http.Handler {
	var h http.Handler
	if t.IdentityProvider == "" {
		h = reverseProxy(t.Target)
	} else {
		h = tokenExchangeReverseProxy(t.Target, t.IdentityProvider, t.Scope)
	}
	if t.StripPrefix {
		return http.StripPrefix(prefix, h)
	}
	return h
}

type proxyMap map[string]*proxyTarget

func (m proxyMap) configure(mux *http.ServeMux) {
	for prefix, t := range m {
		mux.Handle(prefix, t.handler(prefix))
	}
}

var proxies = proxyMap{
	"/api/": &proxyTarget{
		Target:           getEnvUrl("HOTSAK_API_URL"),
		StripPrefix:      false,
		IdentityProvider: texas.IdentityProviderEntraId,
		Scope:            os.Getenv("HOTSAK_API_SCOPE"),
	},
	"/grunndata-api/": &proxyTarget{
		Target:      getEnvUrl("GRUNNDATA_API_URL"),
		StripPrefix: true,
	},
	"/alternativprodukter-api/": &proxyTarget{
		Target:      getEnvUrl("ALTERNATIVPRODUKTER_API_URL"),
		StripPrefix: true,
	},
	"/brille-api/": &proxyTarget{
		Target:      getEnvUrl("BRILLE_API_URL"),
		StripPrefix: true,
	},
}

func reverseProxy(target *url.URL) *httputil.ReverseProxy {
	return &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
		},
	}
}

func tokenExchangeReverseProxy(target *url.URL, identityProvider texas.IdentityProvider, scope string) *httputil.ReverseProxy {
	return &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			userToken, ok := getUserToken(r.In)
			if !ok {
				slog.Warn("proxy: token missing")
				return
			}
			token, err := texas.ExchangeToken(identityProvider, scope, userToken)
			if err != nil {
				slog.Error("proxy: token error", "error", err)
				return
			}
			r.Out.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token.AccessToken))
		},
	}
}
