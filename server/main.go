package main

import (
	"net/http"
	"os"

	"github.com/navikt/hotbff"
	"github.com/navikt/hotbff/httpx"
	"github.com/navikt/hotbff/proxy"
	"github.com/navikt/hotbff/texas"
)

var (
	useMSW = os.Getenv("USE_MSW") == "true"
	idp    = texas.EntraID
)

func init() {
	if useMSW {
		idp = nil
	}
}

func main() {
	opts := &hotbff.Options{
		BasePath: "/",
		RootDir:  "dist",
		Proxy: proxy.Map{
			"/api/": &proxy.Options{
				Target:      os.Getenv("HOTSAK_API_URL"),
				StripPrefix: false,
				IDPTarget:   os.Getenv("HOTSAK_API_SCOPE"),
			},
			"/db-scheduler/": &proxy.Options{
				Target:      os.Getenv("HOTSAK_API_URL"),
				StripPrefix: false,
				IDPTarget:   os.Getenv("HOTSAK_API_SCOPE"),
			},
			"/db-scheduler-api/": &proxy.Options{
				Target:      os.Getenv("HOTSAK_API_URL"),
				StripPrefix: false,
				IDPTarget:   os.Getenv("HOTSAK_API_SCOPE"),
			},
			"/grunndata-api/": &proxy.Options{
				Target:      os.Getenv("GRUNNDATA_API_URL"),
				StripPrefix: true,
			},
			"/alternativprodukter-api/": &proxy.Options{
				Target:      os.Getenv("ALTERNATIVPRODUKTER_API_URL"),
				StripPrefix: true,
			},
			"/brille-api/": &proxy.Options{
				Target:      os.Getenv("BRILLE_API_URL"),
				StripPrefix: true,
			},
			"/modiacontextholder-api/": &proxy.Options{
				Target:      os.Getenv("MODIACONTEXTHOLDER_API_URL"),
				StripPrefix: true,
			},
		},
		IDP: idp,
		EnvKeys: []string{
			"NAIS_CLUSTER_NAME",

			"FARO_URL",
			"IMAGE_PROXY_URL",

			"UMAMI_ENABLED",
			"UMAMI_WEBSITE_ID",

			"USE_MSW",
			"USE_MSW_GRUNNDATA",
			"USE_MSW_ALTERNATIVPRODUKTER",

			"GIT_COMMIT",

			"GOSYS_OPPGAVEBEHANDLING_URL",
			"MODIA_URL",
			"SPORREUNDERSOKELSE_URL",
		},
	}

	mux := http.NewServeMux()
	if useMSW {
		gjeldendeEnhet := &enhet{
			Nummer: "2970",
			Navn:   "IT-avdelingen",
		}
		ansatt := &autentisertAnsatt{
			ID:    "S112233",
			Navn:  "Silje Saksbehandler",
			Epost: "silje.saksbehandler@nav.no",
			Grupper: []string{
				"HOTSAK_BRUKERE",
				"HOTSAK_SAKSBEHANDLER",
				"BRILLEADMIN_BRUKERE",
			},
			Enheter:        []*enhet{gjeldendeEnhet},
			GjeldendeEnhet: gjeldendeEnhet,
			Enhetsnumre: []string{
				gjeldendeEnhet.Nummer,
			},
		}
		mux.Handle("GET /api/ansatte/meg", httpx.ServeJSON(ansatt))
		endringslogg := &[]string{}
		mux.Handle("GET /api/endringslogg", httpx.ServeJSON(endringslogg))
	}

	hotbff.Start(mux, opts)
}

type enhet struct {
	Nummer string `json:"nummer"`
	Navn   string `json:"navn"`
}

type autentisertAnsatt struct {
	ID             string   `json:"id"`
	Navn           string   `json:"navn"`
	Epost          string   `json:"epost"`
	Grupper        []string `json:"grupper"`
	Enheter        []*enhet `json:"enheter"`
	GjeldendeEnhet *enhet   `json:"gjeldendeEnhet"`
	Enhetsnumre    []string `json:"enhetsnumre"`
}
