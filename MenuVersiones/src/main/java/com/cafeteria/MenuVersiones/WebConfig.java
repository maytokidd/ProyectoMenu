package com.cafeteria.MenuVersiones;

import com.cafeteria.MenuVersiones.controladores.RoleFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<RoleFilter> filtroRoles() {
        FilterRegistrationBean<RoleFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(new RoleFilter());
        reg.addUrlPatterns("/*");
        return reg;
    }
}
