package com.yourorg.appname;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppNameApplication {

    private static final Logger logger = LoggerFactory.getLogger(AppNameApplication.class);

    public static void main(String[] args) {
        // Auto-detect cloud environment (Render sets DATABASE_URL and/or RENDER=true)
        String databaseUrl = System.getenv("DATABASE_URL");
        String isRender = System.getenv("RENDER");
        String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
        if (activeProfile == null || activeProfile.trim().isEmpty()) {
            activeProfile = System.getProperty("spring.profiles.active");
        }

        if ((activeProfile == null || activeProfile.trim().isEmpty() || "local".equalsIgnoreCase(activeProfile))
                && ((databaseUrl != null && !databaseUrl.trim().isEmpty()) || "true".equalsIgnoreCase(isRender))) {
            logger.info("Cloud environment detected (DATABASE_URL / RENDER). Automatically setting active profile to 'postgres'.");
            System.setProperty("spring.profiles.active", "postgres");
        }

        SpringApplication.run(AppNameApplication.class, args);
    }
}
