# ==============================================================================
# Multi-Stage Dockerfile for Spring Boot Backend (Context: backend/)
# ==============================================================================

# Stage 1: Build JAR with Maven & Eclipse Temurin 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace

# Copy pom.xml and source code to package application
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal, Secure Non-Root JRE Runtime
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create unprivileged spring user and group for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled JAR from builder stage
COPY --from=builder /workspace/target/*.jar app.jar

# Set file ownership
RUN chown -R spring:spring /app
USER spring:spring

# Render assigns dynamic PORT environment variable at runtime
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres
ENV RENDER=true
EXPOSE 8080

# Production JVM optimizations for container memory constraints (e.g. Render 512MB free tier)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]