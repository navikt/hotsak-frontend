package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/navikt/hotbff/texas"
)

func TestNewUnleashFrontendProxy_NotConfigured(t *testing.T) {
	tests := []struct {
		name           string
		serverAPIURL   string
		serverAPIToken string
	}{
		{"missing url", "", "some-token"},
		{"missing token", "https://teamdigihot-unleash-api.nav.cloud.nais.io", ""},
		{"missing both", "", ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler, err := newUnleashFrontendProxy(texas.NewTestIDP("", true, nil), tt.serverAPIURL, tt.serverAPIToken)
			if err != nil {
				t.Fatalf("newUnleashFrontendProxy() error = %v, want nil", err)
			}

			req := httptest.NewRequest(http.MethodGet, "/", nil)
			req.Header.Set("Authorization", "Bearer valid_token")
			w := httptest.NewRecorder()
			handler.ServeHTTP(w, req)

			if w.Code != http.StatusServiceUnavailable {
				t.Errorf("got status %d, want %d", w.Code, http.StatusServiceUnavailable)
			}
		})
	}
}

func TestNewUnleashFrontendProxy_RequiresAuthentication(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		t.Error("upstream should not be called for unauthenticated requests")
		w.WriteHeader(http.StatusOK)
	}))
	defer upstream.Close()

	idp := texas.NewTestIDP("", false, nil)
	handler, err := newUnleashFrontendProxy(idp, upstream.URL, "server-token")
	if err != nil {
		t.Fatalf("newUnleashFrontendProxy() error = %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer some_token")
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("got status %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestNewUnleashFrontendProxy_ForwardsAuthenticatedRequests(t *testing.T) {
	const serverToken = "server-side-frontend-token"
	const clientSuppliedKey = "whatever-the-browser-sent"

	var (
		gotPath          string
		gotAuthorization string
		gotRawQuery      string
	)
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotPath = r.URL.Path
		gotAuthorization = r.Header.Get("Authorization")
		gotRawQuery = r.URL.RawQuery
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"toggles":[]}`))
	}))
	defer upstream.Close()

	idp := texas.NewTestIDP("", true, nil)
	handler, err := newUnleashFrontendProxy(idp, upstream.URL, serverToken)
	if err != nil {
		t.Fatalf("newUnleashFrontendProxy() error = %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/client/features?appName=hotsak-frontend", nil)
	req.Header.Set("Authorization", "Bearer valid_token")
	req.Header.Set("X-Unleash-Client-Key", clientSuppliedKey)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("got status %d, want %d, body: %s", w.Code, http.StatusOK, w.Body.String())
	}
	if gotPath != "/api/frontend/client/features" {
		t.Errorf("got upstream path %q, want %q", gotPath, "/api/frontend/client/features")
	}
	if gotRawQuery != "appName=hotsak-frontend" {
		t.Errorf("got upstream query %q, want %q", gotRawQuery, "appName=hotsak-frontend")
	}
	if gotAuthorization != serverToken {
		t.Errorf("got upstream Authorization %q, want the server token %q", gotAuthorization, serverToken)
	}
	if gotAuthorization == clientSuppliedKey {
		t.Error("upstream Authorization must not be whatever the browser sent")
	}
}

func TestNewUnleashFrontendProxy_NeverLeaksTokenToClient(t *testing.T) {
	const serverToken = "server-side-frontend-token"

	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	defer upstream.Close()

	idp := texas.NewTestIDP("", true, nil)
	handler, err := newUnleashFrontendProxy(idp, upstream.URL, serverToken)
	if err != nil {
		t.Fatalf("newUnleashFrontendProxy() error = %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer valid_token")
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	for name, values := range w.Header() {
		for _, v := range values {
			if v == serverToken {
				t.Errorf("response header %q leaked the server token", name)
			}
		}
	}
	if w.Body.String() == serverToken {
		t.Error("response body leaked the server token")
	}
}
