package com.github.rahulstech.stt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SpeechToTextApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpeechToTextApplication.class, args);
	}

}
