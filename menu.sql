-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 02-11-2025 a las 03:56:33
-- Versión del servidor: 11.8.3-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u330857585_elevasushi`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `foto` varchar(30) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `precio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `foto`, `nombre`, `descripcion`, `id_tipo`, `precio`) VALUES
(1, 'RollosPrimavera.jpg', 'Rollos Primavera 3pzas', 'Rollos rellenos de camarón, phila y queso chihuahua.', 1, 70),
(2, 'ChilesEspeciales.jpg', 'Chiles Especiales 1pza', 'Tampico, phila, queso chihuaha, res, camarón y salsa anguila.', 1, 50),
(3, 'Nuggets.jpg', 'Nuggets 5pzas', 'Nuggets', 1, 65),
(4, 'Ramen.jpg', 'Ramen', 'Fideo, Pork Belly, Res, Camarón, Huevo, Alga, Cebollin, Zanahoria.', 2, 120),
(5, 'SopaOriental.jpg', 'Sopa oriental', 'Pollo, fideo de arroz, brócoli, coliflor, zanahoria, cebolla y apio.', 2, 110),
(6, 'SopaDeCamaron.jpg', 'Sopa de camarón', 'Camarón, fideo arroz, brócoli, coliflor, zanahoria, cebolla y apio', 2, 130),
(7, 'ArrozEspecial.jpg', 'Arroz frito', 'Pollo, res, camaron, cebollin, zanahoria', 3, 110),
(8, 'PolloMongol.jpg', 'Pollo Mongol', 'Pollo capeado servido con calabaza, pimiento verde, cebolla, chile de árbol y cacahuate en salsa mongol', 3, 110),
(9, 'PolloAgridulce.jpg', 'Pollo Agridulce', 'Pollo capeado en salsa agridulce', 3, 110),
(10, 'ChowMein.jpg', 'Chow Mein Especial', 'Pollo, res, camarón, brócoli, zanahoria, coliflor, cebolla y apio', 3, 110),
(11, 'PolloAlmendado.jpg', 'Pollo Almendrado', 'Pollo, brócoli, zanahoria, cebolla, apio y almendras tostadas', 3, 110),
(12, 'PolloEnSalsaDeOstion.jpg', 'Pollo en salsa de ostion', 'Pollo, coliflor, zanahoria, cebollín, cebolla y apio.', 3, 110),
(13, 'ResConBrocoli.jpg', 'Res con brocoli', 'Res, brócoli, cebolla, pimiento verde y apio.', 3, 110),
(14, 'PolloALaPlancha.jpg', 'Pollo a la plancha ', 'Tiras de pollo a la plancha en una cama de cebolla en salsa especial', 3, 110),
(15, 'Bomba.jpg', 'Bomba', 'Camarón, res, phila, tapico, aguacate, y salsa de anguila.', 4, 95),
(16, 'GohanEspecial.jpg', 'Gohan Especial', 'Camarón, res, phila, tampico, aguacate y salsa de anguila, sobre arroz blanco.', 4, 95),
(17, 'YaquimeshiEspecial1.jpg', 'Yaquimeshi Especial', 'Arroz frito, camarón, res, phila, tampico y aguacate.', 4, 95),
(18, 'ChickenChesse.jpg', 'Chicken Cheese', 'Pollo, phila, aguacate por dentro y queso cheddar por fuera', 5, 75),
(19, 'MarYTierra.jpg', 'Mar y Tierra', 'Camarón, res, phila y aguacate', 5, 75),
(20, 'CieloMarYTierra.jpg', 'Cielo, Mar y TIerra', 'Pollo, camarón, res, phila y aguacate', 5, 75),
(21, 'TresQuesos.jpg', 'Tres Quesos', 'Camarón, res, phila, aguacatepor dentro y tres quesos por fuera', 5, 85),
(22, 'CamaronBlue.jpg', 'Camarón Blue', 'Camarón, tocino, phila, aguacate por dentro y gratinado por fuera', 5, 95),
(23, 'HotCheeseRoll.jpg', 'Hot Cheese Roll', 'Camarón, res, phila, aguacate por dentro y gratinado picoso por fuera', 5, 95),
(24, 'ParrillaRoll.jpg', 'Parrilla Roll', 'Phila, aguacate, tampico, gratinado de tocino, cambray y topping de camarón a la parrilla', 5, 125),
(25, 'ChavellaRoll.jpg', 'Chavela Roll', 'Tocino, nugget, phila, aguacate por dentro, abocado y pollo picoso por fuera', 5, 125),
(26, 'PhiladelphiaRoll.jpg', 'Philadelphia Roll', 'Pollo, tocino, phila, pepino, aguacate por dentro envuelto en phila y empanizado', 5, 125),
(27, 'CangrejitoRoll.jpg', 'Cangrejito Roll', 'Cangrejo, phila, aguacate por dentro y cangrejo por fuera', 6, 75),
(28, 'Guamuchilito.jpg', 'Guamuchilito', 'Camarón, cangrejo, phila, aguacate por dentro, tampico, aguacate y salsa de anguila por fuera', 6, 95),
(29, 'AvocadoRoll.jpg', 'Avocado Roll', 'Tocino, surimi, camarón, phila, aguacate por dentro, decorado de aguacate por fuera', 6, 95),
(30, 'VegetalRoll.jpg', 'Vegetal Roll', 'Aguacate, zanahoria, pepino y phila', 6, 75),
(31, 'ElevaRoll.jpg', 'Eleva Roll', 'Res, tocino, phila, aguacate por dentro, avocado, surimi mechudo picoso y quesos chihuahua flameado por fuera', 6, 125),
(32, 'boneles.jpg', 'Boneles', 'Salsa a escoger (BBQ, Red-hot, BBQ-Sriracha) acompañada de pepino, zanahoria y ranch 500g', 1, 140),
(33, 'alitas.jpg', 'Alitas', 'Salsa a escoger (BBQ, Red-hot, BBQ-Sriracha) acompañada de pepino, zanahoria y ranch 20pz', 1, 150),
(34, 'Tostada.jpg', 'Tostada', 'Ceviche especial de la casa con atún fresco, camarón cocido, cebolla rayada sobre una tostada doble de Wonton, aderezo de la casa, una cama de aguacate y decorada con frituras', 1, 130),
(35, 'Costillitas.jpg', 'Costillitas', '500 grs. de tradicionales costillas acompañadas de elote dulce servidas en salsa a escoger BBQ, Red Hot ó Mango habanero', 1, 150),
(36, 'OrdenDePapas.jpg', 'Orden De Papas', 'Papas', 1, 35);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipo` (`id_tipo`),
  ADD KEY `id_tipo_2` (`id_tipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
