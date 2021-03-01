import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export default function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
      keycloak.init({
        config: {
          url: environment.keycloakUrl,
          realm: environment.realm,
          clientId: environment.clientId,
        },
        initOptions: {
          checkLoginIframe: true,
          checkLoginIframeInterval: 25,
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html',
        },
        loadUserProfileAtStartUp: true,
        bearerExcludedUrls: ['/assets'],
      });
  }