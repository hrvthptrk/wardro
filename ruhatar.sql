-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Sze 25. 10:50
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12
--
-- Kiegészítve 2026.10.07-én, hogy a backend tényleg lefedje a felületen már
-- meglévő funkciókat (kategória-szerkesztés, címkék, 30 napos visszaállítás,
-- időjárás-alapú javaslat, kedvenc outfit). Minden új rész jelölve van.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `ruhatar`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile` enum('Male','Female') NOT NULL DEFAULT 'Male', -- ÚJ: ez alapján kapja a kezdő kategóriákat regisztrációkor
  `settings` text DEFAULT NULL, -- ÚJ: JSON-ként a kisebb beállítások (density, showUnwornFlags, reminders)
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories` (ÚJ TÁBLA)
--
-- Korábban a `clothes.category` csak sima szöveg volt. Azért kellett ez a
-- külön tábla, mert a Beállítások képernyőn a kategóriák saját sorok:
-- átnevezhetők, törölhetők, és regisztrációkor üresen (ruha nélkül) jönnek
-- létre - ezt egy puszta varchar oszlop nem tudja visszaadni.
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `clothes`
--

CREATE TABLE `clothes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL, -- VÁLTOZOTT: korábban `category` varchar volt, most a categories táblára mutat
  `color` varchar(50) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL, -- ÚJ: vesszővel elválasztott címkék, pl. "Pamut,Semleges,Egész évben"
  `image_url` varchar(255) DEFAULT NULL,
  `worn_today` tinyint(1) NOT NULL DEFAULT 0, -- ÚJ
  `last_worn_at` timestamp NULL DEFAULT NULL, -- ÚJ
  `removed_at` timestamp NULL DEFAULT NULL, -- ÚJ: nem törli a sort, csak megjelöli; 30 nap után a backend véglegesen törli
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `outfits`
--

CREATE TABLE `outfits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `occasion` varchar(50) DEFAULT NULL,
  `season` varchar(20) DEFAULT NULL, -- ÚJ: Hideg / Enyhe / Meleg, az időjárás-alapú javaslathoz
  `favourite` tinyint(1) NOT NULL DEFAULT 0, -- ÚJ
  `worn_today` tinyint(1) NOT NULL DEFAULT 0, -- ÚJ
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `outfit_clothes`
--

CREATE TABLE `outfit_clothes` (
  `outfit_id` int(11) NOT NULL,
  `clothing_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);
  -- a `username` szándékosan NEM egyedi: nálunk ez csak egy megjelenített
  -- név (pl. "Kovács Anna"), nem bejelentkezési azonosító - arra az email
  -- szolgál. Két felhasználó simán viselheti ugyanazt a nevet.

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `clothes`
--
ALTER TABLE `clothes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `outfits`
--
ALTER TABLE `outfits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `outfit_clothes`
--
ALTER TABLE `outfit_clothes`
  ADD PRIMARY KEY (`outfit_id`,`clothing_id`),
  ADD KEY `clothing_id` (`clothing_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clothes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `outfits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `clothes`
--
ALTER TABLE `clothes`
  ADD CONSTRAINT `clothes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clothes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `outfits`
--
ALTER TABLE `outfits`
  ADD CONSTRAINT `outfits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `outfit_clothes`
--
ALTER TABLE `outfit_clothes`
  ADD CONSTRAINT `outfit_clothes_ibfk_1` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outfit_clothes_ibfk_2` FOREIGN KEY (`clothing_id`) REFERENCES `clothes` (`id`) ON DELETE CASCADE;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `outfit_log` (ÚJ TÁBLA)
--
-- A naptár: melyik nap melyik outfitet viselte a felhasználó. Naponta egy
-- outfit (ezért a kulcs user_id + day). Ha az outfitet törlik, a naptárból
-- is eltűnik.
--

CREATE TABLE `outfit_log` (
  `user_id` int(11) NOT NULL,
  `day` date NOT NULL,
  `outfit_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`day`),
  KEY `outfit_id` (`outfit_id`),
  CONSTRAINT `outfit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `outfit_log_ibfk_2` FOREIGN KEY (`outfit_id`) REFERENCES `outfits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
