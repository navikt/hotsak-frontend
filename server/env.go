package main

import (
	"log/slog"
	"net/url"
	"os"
)

func getEnvUrl(key string) *url.URL {
	urlStr := os.Getenv(key)
	if urlStr == "" {
		slog.Error("missing key", "key", key)
		os.Exit(1)
	}
	u, err := url.Parse(urlStr)
	if err != nil {
		slog.Error("invalid url", "urlStr", urlStr, "error", err)
		os.Exit(1)
	}
	return u
}
