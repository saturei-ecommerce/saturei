# ============================================================
# Build stage — compile and package the application
# ============================================================
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy Maven wrapper and pom first (layer cache: only re-downloads deps if pom changes)
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./

RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy source and build the jar (skip tests — tests run in CI)
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ============================================================
# Runtime stage — minimal image with only the JRE
# ============================================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Non-root user for security
RUN addgroup -S saturei && adduser -S saturei -G saturei
USER saturei

WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Health check using Spring Boot Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
