package com.cafeteria.MenuVersiones.controladores;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class RoleFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String uri = request.getRequestURI();
        HttpSession session = request.getSession(false);

        // permitir login y archivos estáticos
        if (uri.contains("login") || uri.contains("css") || uri.contains("js") ||
            uri.endsWith(".png") || uri.endsWith(".jpg") || uri.endsWith(".jpeg") || uri.endsWith(".svg")) {
            chain.doFilter(req, res);
            return;
        }

        if (session == null || session.getAttribute("rol") == null) {
            response.sendRedirect("/login.html");
            return;
        }

        String rol = session.getAttribute("rol").toString();

        // proteger admin
        if (uri.startsWith("/admin") && !rol.equals("ADMIN")) {
            response.sendRedirect("/user/dashboard_user.html");
            return;
        }

        // proteger user
        if (uri.startsWith("/user") && !rol.equals("USER")) {
            response.sendRedirect("/admin/dashboard_admin.html");
            return;
        }

        chain.doFilter(req, res);
    }
}
