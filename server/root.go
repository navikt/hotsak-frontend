package main

import (
	"net/http"
	"path"
)

type statusCodeRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (r *statusCodeRecorder) Write(data []byte) (int, error) {
	if r.statusCode != http.StatusNotFound {
		return r.ResponseWriter.Write(data)
	}
	return len(data), nil
}

func (r *statusCodeRecorder) WriteHeader(statusCode int) {
	r.statusCode = statusCode
	if statusCode != http.StatusNotFound {
		r.ResponseWriter.WriteHeader(statusCode)
	}
}

func rootHandler(rootDir string) http.Handler {
	fs := http.FileServer(http.Dir(rootDir))
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		r := &statusCodeRecorder{ResponseWriter: w}
		fs.ServeHTTP(r, req)
		if r.statusCode == http.StatusNotFound {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			http.ServeFile(w, req, path.Join(rootDir, "index.html"))
		}
	})
}
