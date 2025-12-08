package com.cafeteria.MenuVersiones;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;

@SpringBootApplication
public class MenuVersionesApplication {

	public static void main(String[] args) {
		SpringApplication.run(MenuVersionesApplication.class, args);
	}

	// Crea un usuario administrador por defecto al iniciar si no existe
	@Bean
	public CommandLineRunner crearAdminPorDefecto(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				String adminUsername = "admin";
				if (!usuarioRepository.existsByUsername(adminUsername)) {
					String rawPassword = "admin123"; // Cambia esto en producción
					String encoded = passwordEncoder.encode(rawPassword);

					    Usuario admin = new Usuario(
						    "Admin",
						    "Sistema",
						    "admin@localhost",
						    adminUsername,
						    encoded,
						    "Administrador",
						    "Activo"
					    );

					usuarioRepository.save(admin);
					System.out.println("Usuario administrador creado -> usuario: admin  contraseña: " + rawPassword);
				}
			} catch (Exception e) {
				System.err.println("No se pudo crear el usuario admin por defecto: " + e.getMessage());
			}
		};
	}

}