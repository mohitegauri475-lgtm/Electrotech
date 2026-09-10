package com.yourorg.appname.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Smart Database URL Adapter for Render (render.com).
 * Automatically parses Render's injected DATABASE_URL (postgresql://user:pass@host:port/db)
 * and constructs a production-ready JDBC HikariDataSource for PostgreSQL.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            databaseUrl = System.getProperty("DATABASE_URL");
        }

        if (databaseUrl != null && !databaseUrl.trim().isEmpty()) {
            try {
                logger.info("Detected cloud DATABASE_URL environment variable. Parsing Render connection string...");

                String cleanUrl = databaseUrl.trim();
                // Normalize scheme for java.net.URI
                String uriString = cleanUrl;
                if (cleanUrl.startsWith("postgres://")) {
                    uriString = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                // If java.net.URI complains about postgresql scheme, use dummy http for parsing
                URI uri;
                if (uriString.startsWith("postgresql://")) {
                    uri = URI.create(uriString.replaceFirst("^postgresql://", "http://"));
                } else {
                    uri = URI.create(uriString);
                }

                String userInfo = uri.getUserInfo();
                String username = properties.getUsername();
                String password = properties.getPassword();

                if (userInfo != null && userInfo.contains(":")) {
                    String[] userParts = userInfo.split(":", 2);
                    username = URLDecoder.decode(userParts[0], StandardCharsets.UTF_8);
                    password = URLDecoder.decode(userParts[1], StandardCharsets.UTF_8);
                } else if (userInfo != null) {
                    username = URLDecoder.decode(userInfo, StandardCharsets.UTF_8);
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath(); // includes leading slash, e.g. /dbname
                String query = uri.getQuery();

                StringBuilder jdbcUrlBuilder = new StringBuilder();
                jdbcUrlBuilder.append("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path != null && !path.isEmpty() ? path : "/postgres");

                if (query != null && !query.isEmpty()) {
                    jdbcUrlBuilder.append("?").append(query);
                }

                String jdbcUrl = jdbcUrlBuilder.toString();
                logger.info("Render PostgreSQL JDBC URL configured: jdbc:postgresql://{}:{}{}", host, port, path);

                HikariDataSource dataSource = new HikariDataSource();
                dataSource.setDriverClassName("org.postgresql.Driver");
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);

                // Sensible connection pool settings for Render free/starter instances
                dataSource.setMaximumPoolSize(10);
                dataSource.setMinimumIdle(2);
                dataSource.setIdleTimeout(300000);
                dataSource.setConnectionTimeout(20000);

                return dataSource;
            } catch (Exception e) {
                logger.error("Failed to parse DATABASE_URL: {}. Falling back to default datasource properties.", e.getMessage(), e);
            }
        }

        logger.info("Using standard DataSourceProperties for PostgreSQL datasource.");
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
