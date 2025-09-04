package texas

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type IdentityProvider string

const (
	IdentityProviderEntraId      IdentityProvider = "azuread"
	IdentityProviderIdPorten     IdentityProvider = "idporten"
	IdentityProviderMaskinporten IdentityProvider = "maskinporten"
	IdentityProviderTokenX       IdentityProvider = "tokenx"
)

func GetToken(identityProvider IdentityProvider, target string) (*TokenSet, error) {
	data := &url.Values{}
	data.Set("identity_provider", string(identityProvider))
	data.Set("target", target)
	var v *TokenSet
	err := post(tokenUrl, data, &v)
	if err != nil {
		return nil, err
	}
	return v, nil
}

func ExchangeToken(identityProvider IdentityProvider, target string, userToken string) (*TokenSet, error) {
	data := &url.Values{}
	data.Set("identity_provider", string(identityProvider))
	data.Set("target", target)
	data.Set("user_token", userToken)
	var v *TokenSet
	err := post(tokenExchangeUrl, data, &v)
	if err != nil {
		return nil, err
	}
	return v, nil
}

func IntrospectToken(identityProvider IdentityProvider, token string) (*TokenIntrospection, error) {
	data := &url.Values{}
	data.Set("identity_provider", string(identityProvider))
	data.Set("token", token)
	var v *TokenIntrospection
	err := post(tokenIntrospectionUrl, data, &v)
	if err != nil {
		return nil, err
	}
	return v, nil
}

type TokenSet struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

type TokenIntrospection struct {
	Active bool `json:"active"`
}

var (
	tokenUrl              = os.Getenv("NAIS_TOKEN_ENDPOINT")
	tokenExchangeUrl      = os.Getenv("NAIS_TOKEN_EXCHANGE_ENDPOINT")
	tokenIntrospectionUrl = os.Getenv("NAIS_TOKEN_INTROSPECTION_ENDPOINT")
)

func post(url string, data *url.Values, v any) error {
	res, err := http.Post(url, "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		return err
	}
	//goland:noinspection GoUnhandledErrorResult
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected statusCode: %d", res.StatusCode)
	}
	return json.NewDecoder(res.Body).Decode(v)
}
