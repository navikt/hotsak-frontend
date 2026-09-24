package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/navikt/hotbff/httpx"
	"github.com/navikt/hotbff/texas"
)

// newUnleashFrontendProxy builds a handler that proxies feature toggle requests
// from the Unleash React SDK (@unleash/proxy-client-react) to the Unleash Frontend
// API. Access requires a logged in user (checked via idp, same mechanism as the
// other proxied APIs), but unlike those, the Unleash server API token is a static,
// team-scoped secret rather than something obtained through per-user token
// exchange. The token therefore never reaches the browser: whatever clientKey the
// SDK sends is ignored, and this handler always sets its own Authorization header
// from serverAPIToken before forwarding the request upstream.
//
// If serverAPIURL or serverAPIToken is empty (e.g. local development, where there
// is no Unleash connection), the handler always responds 503 Service Unavailable.
func newUnleashFrontendProxy(idp texas.TokenIntrospector, serverAPIURL, serverAPIToken string) (http.Handler, error) {
	if serverAPIURL == "" || serverAPIToken == "" {
		return httpx.Error(http.StatusServiceUnavailable), nil
	}

	target, err := url.Parse(strings.TrimRight(serverAPIURL, "/") + "/api/frontend")
	if err != nil {
		return nil, fmt.Errorf("unleash: invalid server API url: %w", err)
	}

	rp := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			r.Out.Header.Set(httpx.HeaderAuthorization, serverAPIToken)
		},
	}

	return texas.Protected(idp, rp), nil
}
