package texas

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

func GetBearerToken(req *http.Request) (token string, ok bool) {
	return strings.CutPrefix(req.Header.Get("Authorization"), "Bearer ")
}

type JWT struct {
	Header    map[string]any
	Payload   map[string]any
	Signature string
}

func ParseJWT(jwtStr string) (*JWT, error) {
	parts := strings.Split(jwtStr, ".")
	if len(parts) != 3 {
		return nil, errors.New("invalid jwt")
	}
	header, err := parseJWTPart(parts[0])
	if err != nil {
		return nil, err
	}
	payload, err := parseJWTPart(parts[1])
	if err != nil {
		return nil, err
	}
	return &JWT{Header: header, Payload: payload, Signature: parts[2]}, nil
}

func parseJWTPart(base64Str string) (map[string]any, error) {
	data, err := base64.RawURLEncoding.DecodeString(base64Str)
	if err != nil {
		return nil, err
	}
	v := make(map[string]any)
	err = json.Unmarshal(data, &v)
	if err != nil {
		return nil, err
	}
	return v, nil
}
