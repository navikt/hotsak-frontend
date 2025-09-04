package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

var envVarKeys = []string{
	"NAIS_CLUSTER_NAME",

	"FARO_URL",
	"IMAGE_PROXY_URL",

	"UMAMI_ENABLED",
	"UMAMI_WEBSITE_ID",

	"USE_MSW",
	"USE_MSW_GRUNNDATA",
	"USE_MSW_ALTERNATIVPRODUKTER",

	"GIT_COMMIT",
}

func settingsHandler() http.Handler {
	s := make(map[string]any)
	for _, key := range envVarKeys {
		v := os.Getenv(key)
		switch v {
		case "true":
			s[key] = true
		case "false":
			s[key] = false
		default:
			s[key] = v
		}
	}
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
		_, _ = fmt.Fprint(w, "window.appSettings = ")
		enc := json.NewEncoder(w)
		enc.SetIndent("", "  ")
		_ = enc.Encode(&s)
	})
}
