-- Base de datos para el sistema de tablero hospitalario
CREATE DATABASE IF NOT EXISTS tablero_hospitalario;
USE tablero_hospitalario;

-- Tabla de establecimientos
CREATE TABLE establecimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    zona VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    funcion VARCHAR(100) NOT NULL,
    establecimiento_id INT,
    rol_id INT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (establecimiento_id) REFERENCES establecimientos(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema'),
('gerente', 'Gerente de establecimiento');

-- Insertar establecimientos existentes
INSERT INTO establecimientos (codigo, nombre, zona) VALUES
-- ZONA CENTRO
('47', 'Materno Infantil', 'ZONA CENTRO'),
('40', 'San Bernardo', 'ZONA CENTRO'),
('55', 'Papa Francisco', 'ZONA CENTRO'),
('41', 'Señor Del Milagro', 'ZONA CENTRO'),
('43', 'Oñativia', 'ZONA CENTRO'),
('42', 'Ragone', 'ZONA CENTRO'),
('45', 'P.N.A. zona norte', 'ZONA CENTRO'),
('56', 'P.N.A. zona sur', 'ZONA CENTRO'),
('Centro', 'Centro de Rehabilitación', 'ZONA CENTRO'),
('Onco', 'Oncologia', 'ZONA CENTRO'),
('Adic', 'Adicciones', 'ZONA CENTRO'),
('CUCAI', 'CUCAI', 'ZONA CENTRO'),
('Samec', 'Samec', 'ZONA CENTRO'),

-- ZONA NORTE
('01', 'Colonia Sta. Rosa', 'ZONA NORTE'),
('02', 'Pichanal', 'ZONA NORTE'),
('03', 'Aguaray', 'ZONA NORTE'),
('04', 'Morillo', 'ZONA NORTE'),
('07', 'P. Salvador Maza', 'ZONA NORTE'),
('08', 'Sta. Victoria Este', 'ZONA NORTE'),
('09', 'Embarcación', 'ZONA NORTE'),
('11', 'Oran', 'ZONA NORTE'),
('12', 'Tartagal', 'ZONA NORTE'),
('13', 'Rivadavia', 'ZONA NORTE'),
('28', 'Gral. Enrique Mosconi', 'ZONA NORTE'),
('31', 'Hipólito Yrigoyen', 'ZONA NORTE'),
('44', 'Alto la Sierra', 'ZONA NORTE'),
('49', 'Urundel', 'ZONA NORTE'),
('51', 'La Unión', 'ZONA NORTE'),

-- ZONA SUR
('14', 'Las Lajitas', 'ZONA SUR'),
('15', 'J. V. González', 'ZONA SUR'),
('16', 'El Quebrachal', 'ZONA SUR'),
('17', 'El Galpón', 'ZONA SUR'),
('18', 'Rosario de la Frontera', 'ZONA SUR'),
('19', 'Metan', 'ZONA SUR'),
('21', 'El Tala', 'ZONA SUR'),
('22', 'Gral. Güemes', 'ZONA SUR'),
('23', 'Apolinario Saravia', 'ZONA SUR'),
('38', 'El Potrero', 'ZONA SUR'),

-- ZONA OESTE
('05', 'Sta. Victoria Oeste', 'ZONA OESTE'),
('06', 'Iruya', 'ZONA OESTE'),
('10', 'Nazareno', 'ZONA OESTE'),
('24', 'Cafayate', 'ZONA OESTE'),
('25', 'San Carlos', 'ZONA OESTE'),
('26', 'Molinos', 'ZONA OESTE'),
('27', 'Cachi', 'ZONA OESTE'),
('29', 'San Antonio de los Cobres', 'ZONA OESTE'),
('30', 'Cerrillos', 'ZONA OESTE'),
('32', 'Rosario de Lerma', 'ZONA OESTE'),
('33', 'Chicoana', 'ZONA OESTE'),
('34', 'El Carril', 'ZONA OESTE'),
('35', 'Cnel. Moldes', 'ZONA OESTE'),
('36', 'La Viña', 'ZONA OESTE'),
('37', 'Guachipas', 'ZONA OESTE'),
('39', 'La Caldera', 'ZONA OESTE'),
('46', 'Campo Quijano', 'ZONA OESTE'),
('48', 'Seclantas', 'ZONA OESTE'),
('50', 'La Merced', 'ZONA OESTE'),
('52', 'La Poma', 'ZONA OESTE'),
('53', 'Angastaco', 'ZONA OESTE');

-- Crear usuario administrador por defecto
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO usuarios (dni, nombre_completo, email, password, funcion, establecimiento_id, rol_id) VALUES
('admin', 'Administrador del Sistema', 'admin@tablero.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 1, 1); 