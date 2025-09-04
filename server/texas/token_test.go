package texas

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

const jwtStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

func TestGetBearerToken(t *testing.T) {
	var token string
	var want string

	req := httptest.NewRequest(http.MethodGet, "/", nil)

	want = jwtStr
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", want))
	if token, _ = GetBearerToken(req); token != want {
		t.Errorf("getToken(req) = %q, want %q", token, want)
	}

	want = ""
	req.Header.Del("Authorization")
	if token, _ = GetBearerToken(req); token != want {
		t.Errorf("getToken(req) = %q, want %q", token, want)
	}
}

func TestParseJWT(t *testing.T) {
	j, err := ParseJWT(jwtStr)
	if err != nil {
		t.Fatal(err)
	}

	want := "HS256"
	if alg := j.Header["alg"]; alg != want {
		t.Errorf("alg was %q, want %q", alg, want)
	}

	want = "1234567890"
	if n := j.Payload["sub"]; n != want {
		t.Errorf("sub was %q, want %q", n, want)
	}
}
