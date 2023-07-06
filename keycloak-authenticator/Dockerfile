FROM quay.io/keycloak/keycloak:21.1.0

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

WORKDIR /opt/keycloak

COPY ./realm-export.json ./data/import/realm.json

EXPOSE 8080

ENTRYPOINT [ "./bin/kc.sh", "start-dev", "--import-realm"]

