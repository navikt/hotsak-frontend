package main

import (
	"os"

	"github.com/navikt/hotbff"
	"github.com/navikt/hotbff/proxy"
	"github.com/navikt/hotbff/texas"
)

var (
	useMSW = os.Getenv("USE_MSW") == "true"
	idp    = texas.EntraID
)

func init() {
	if useMSW {
		idp = ""
	}
}

func main() {
	opts := &hotbff.Options{
		BasePath: "/",
		RootDir:  "dist",
		Proxy: &proxy.Map{
			"/api/": &proxy.Options{
				Target:      os.Getenv("HOTSAK_API_URL"),
				StripPrefix: false,
				IDP:         texas.EntraID,
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
		},
		IDP: idp,
		EnvKeys: &[]string{
			"NAIS_CLUSTER_NAME",

			"FARO_URL",
			"IMAGE_PROXY_URL",

			"UMAMI_ENABLED",
			"UMAMI_WEBSITE_ID",

			"USE_MSW",
			"USE_MSW_GRUNNDATA",
			"USE_MSW_ALTERNATIVPRODUKTER",

			"GIT_COMMIT",
		},
	}
	hotbff.Start(opts)
}
