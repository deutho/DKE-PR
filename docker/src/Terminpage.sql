-- phpMyAdmin SQL Dump
-- version 4.5.0.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 22. Dez 2016 um 20:27
-- Server-Version: 10.0.17-MariaDB
-- PHP-Version: 5.6.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `Terminpage`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bookings`
--

CREATE TABLE `bookings` (
  `id` int(100) NOT NULL,
  `date` date NOT NULL,
  `start` time NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `bookings`
--

INSERT INTO `bookings` (`id`, `date`, `start`, `name`, `email`, `phone`) VALUES
(1, '2016-11-15', '09:30:00', 'Marius', 'marius.doci@gmail.at', '06608888888888');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Kunde`
--

CREATE TABLE `Kunde` (
  `KundenID` int(16) NOT NULL,
  `Vorname` varchar(16) NOT NULL,
  `Nachname` varchar(16) NOT NULL,
  `Email` varchar(16) NOT NULL,
  `Passwort` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Daten für Tabelle `Kunde`
--

INSERT INTO `Kunde` (`KundenID`, `Vorname`, `Nachname`, `Email`, `Passwort`) VALUES
(1, 'd', 'd', 'd', 'd'),
(2, 'asdf', 'asdf', 'asdf', 'asdf'),
(3, 'a', '', '', ''),
(4, 'a', 'a', 'a', 's'),
(6, 'asdf2qr234', '234234asdf', 'asdf@g.com', 'asdfasdf'),
(7, 'asdf', 'asdf', 'asdasd@gmai.com', 'asdf'),
(8, 'd', 'd', 'd@gm.com', 'Confirm Password'),
(10, 's', 's', 's@gmail.com', 's'),
(11, 'd', 's', 's', 's'),
(13, 'w', 'w', 'w', 'w'),
(15, 'First Name', 'Last Name', 'Email Id', 'a'),
(17, 'First Name', 'Last Name', 'Email', 'h'),
(28, 's', 's', 'ss', 's'),
(31, 'qwer', 'qwer', 'qwer', 'qwer'),
(32, 'ww', 'www', 'ww', 'ww'),
(38, 't', 't', 't', 't'),
(39, 'g', 'g', 'g', 'g'),
(42, 'sss', 'sss', 'marius@gmail.com', 'a'),
(45, 'a', 'a', 'r', 'a'),
(46, 'Marius', 'D', 'marius@gmail.de', '123'),
(47, 'M', 'M', 'samed.esen@gmail', '123'),
(48, 'f', 'f', 'f', 'f'),
(52, 'sdsad', 'asdsa', 'sasad', '123'),
(53, 'Marius', 'Doci', 'marius@asdf.de', 'asdf'),
(54, 'Marius', 'Doci', 'marius.doci@gmai', '1234'),
(55, '1234', '1234', '1234', '1234');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Termine`
--

CREATE TABLE `Termine` (
  `KundenID` int(16) NOT NULL,
  `Zeit` date NOT NULL,
  `Tag` date NOT NULL,
  `Grund` varchar(64) CHARACTER SET utf16 COLLATE utf16_german2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Kunde`
--
ALTER TABLE `Kunde`
  ADD PRIMARY KEY (`KundenID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indizes für die Tabelle `Termine`
--
ALTER TABLE `Termine`
  ADD PRIMARY KEY (`KundenID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `Kunde`
--
ALTER TABLE `Kunde`
  MODIFY `KundenID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT für Tabelle `Termine`
--
ALTER TABLE `Termine`
  MODIFY `KundenID` int(16) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
