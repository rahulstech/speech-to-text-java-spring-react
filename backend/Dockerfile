
FROM eclipse-temurin:21-jre-alpine-3.23

WORKDIR /app

COPY /build/libs/speech-to-text-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]