package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
)

var (
	port    = flag.Int("p", 3000, "")
	rootDir = flag.String("d", "./dist", "")
)

func init() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(handler)
	slog.SetDefault(logger)
}

func main() {
	flag.Parse()

	http.HandleFunc("GET /isalive", func(w http.ResponseWriter, req *http.Request) {
		_, _ = fmt.Fprint(w, "ALIVE")
	})
	http.HandleFunc("GET /isready", func(w http.ResponseWriter, req *http.Request) {
		_, _ = fmt.Fprint(w, "READY")
	})
	http.Handle("GET /settings.js", settingsHandler())

	mux := http.NewServeMux()
	for prefix, t := range proxies {
		mux.Handle(prefix, t.handler(prefix))
	}
	mux.Handle("/", rootHandler(*rootDir))
	http.Handle("/", protectedHandler(mux))

	slog.Info("server starting", "port", *port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil); err != nil {
		slog.Error("server startup failed", "error", err)
		os.Exit(1)
	}
}
