FROM prom/prometheus:v2.30.3

COPY prometheus.yaml /etc/prometheus/

EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yaml"]

