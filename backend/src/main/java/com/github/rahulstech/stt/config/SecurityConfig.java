package com.github.rahulstech.stt.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain getSecurityFilterChain(
            HttpSecurity http,
            /* corsOrigins are set in environment variables in application.properties */
            @Value("${CORS_ALLOWED_ORIGINS}") List<String> corsOrigins
    ) throws Exception {
        http
                .authorizeHttpRequests(auth ->
                        auth
                                // NOTE: must allow all preflight requests from browser. even then protected endpoints too.
                                // preflight i.e. http options requests usually don't contain any bearer token,
                                // if I don't exclude those requests then requests with valid bearer token will also fail
                                .requestMatchers(
                                        HttpMethod.OPTIONS,
                                        "/api/**"
                                ).permitAll()

                                // put he url path patters or url paths which are excluded for authorization
                                // i.e. spring will not ask authorization for the following matched url paths
                                .requestMatchers(
                                        "/api/auth/register",
                                        "/api/auth/login"
                                ).permitAll()

                                // otherwise require authorization
                                .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .oauth2ResourceServer(oauth2 -> {
                    oauth2.jwt(Customizer.withDefaults());
                })
                .cors(corsConfigurer -> {
                    // TODO: improve cors configuration
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(corsOrigins);
                    corsConfiguration.setAllowedMethods(List.of("*"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));

                    UrlBasedCorsConfigurationSource configurationSource = new UrlBasedCorsConfigurationSource();
                    configurationSource.registerCorsConfiguration("/api/**", corsConfiguration);

                    corsConfigurer.configurationSource(configurationSource);
                })
                .csrf(it -> it.disable()) // stateless idToken authentication does not require csrf
                .formLogin(it -> it.disable()) // api server don't need form login
                .httpBasic(it -> it.disable()) // api server don't need basic authentication
        ;

        return http.build();
    }

    @Bean
    public PasswordEncoder getBCryptHasher() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public JwtDecoder getJwtDecoder(RSAPublicKey publicKey) {
        return NimbusJwtDecoder
                .withPublicKey(publicKey)
                .build();
    }

    @Bean
    public JwtEncoder getJwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    public JWKSet getJWKSet(RSAPublicKey publicKey, RSAPrivateKey privateKey) {
        JWK jwk = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .build();
        return new JWKSet(jwk);
    }

    @Bean
    public JWKSource<SecurityContext> getJWKSource(JWKSet jwkSet) {
        return new ImmutableJWKSet<>(jwkSet);
    }

    @Bean
    public RSAPublicKey loadPublicKey(@Value("${JWT_PUBLIC_KEY}") String base64PublicKey) throws Exception {

        byte[] decoded = Base64.getDecoder().decode(base64PublicKey);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);

        KeyFactory factory = KeyFactory.getInstance("RSA");

        return (RSAPublicKey) factory.generatePublic(spec);
    }

    @Bean
    public RSAPrivateKey loadPrivateKey(@Value("${JWT_PRIVATE_KEY}") String base64PrivateKey) throws Exception {
        byte[] decoded = Base64.getDecoder().decode(base64PrivateKey);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);

        KeyFactory factory = KeyFactory.getInstance("RSA");

        return (RSAPrivateKey) factory.generatePrivate(spec);
    }

//    @Bean("auth_user")
//    public User getAuthUser(Authentication auth, UserService userService) {
//        var sub = auth.getName();
//        var userId = Long.valueOf(sub);
//        return userService.getUserById(userId);
//    }
}
