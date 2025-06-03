-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 03 juin 2025 à 11:02
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `watch`
--

-- --------------------------------------------------------

--
-- Structure de la table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orderitems`
--

INSERT INTO `orderitems` (`id`, `orderId`, `productId`, `quantity`, `createdAt`, `updatedAt`) VALUES
(1, 2, 10, 1, '2024-07-26 14:27:47', '2024-07-26 14:27:47');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `total` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `total`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, '570', 'En attente', '2024-06-20 19:47:55', '2024-06-20 19:47:55'),
(2, 2, '185', 'En attente', '2024-07-26 14:27:47', '2024-07-26 14:27:47');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `prix` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `marque` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image`, `prix`, `genre`, `marque`, `createdAt`, `updatedAt`) VALUES
(1, 'GIANNI T-BAR BICOLORE', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718908835966armani1.png', '185,95', 'femme', 'armani', '2024-06-20 18:40:35', '2024-06-20 18:40:35'),
(2, 'GIANNI T-BAR GOLD', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718908922897armani2.png', '195,99', 'femme', 'armani', '2024-06-20 18:42:02', '2024-06-20 18:42:02'),
(3, 'GIANNI T-BAR ROSE GOLD', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718908997295armani3.png', '190,99', 'femme', 'armani', '2024-06-20 18:43:17', '2024-06-20 18:43:17'),
(4, 'GIANNI T-BAR SILVER', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718909115681armani4.png', '195,99', 'femme', 'armani', '2024-06-20 18:45:15', '2024-06-20 18:45:15'),
(5, 'BOSS COURSE BICOLORE', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718909224390boss1.png', '195,99', 'femme', 'boss', '2024-06-20 18:47:04', '2024-06-20 18:47:04'),
(6, 'BOSS RAFALE BLACK', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718909387293boss2.png', '120', 'femme', 'boss', '2024-06-20 18:49:47', '2024-06-20 18:49:47'),
(7, 'BOSS ADMIRAL BLUE', 'Montre Hugo Boss pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm.', 'image_1718909516327boss3.png', '120', 'femme', 'boss', '2024-06-20 18:51:56', '2024-06-20 18:51:56'),
(8, 'IKON SILVER GOLD', 'Montre Hugo Boss pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm.', 'image_1718909600192boss4.png', '185,95', 'femme', 'boss', '2024-06-20 18:53:20', '2024-06-20 18:53:20'),
(9, 'THE CITY BLACK', 'Montre Burberry pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm.', 'image_1718909885891burberry2.png', '195,95', 'femme', 'burberry', '2024-06-20 18:58:05', '2024-06-20 18:58:05'),
(10, 'THE CITY ROSE GOLD', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910294486burberry3.png', '185,95', 'femme', 'burberry', '2024-06-20 19:04:54', '2024-06-20 19:04:54'),
(11, 'THE CITY SILVER', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910354290burberry4.png', '185,95', 'femme', 'burberry', '2024-06-20 19:05:54', '2024-06-20 19:05:54'),
(12, 'LEXINGTON PINK', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910503937mk1.png', '190,00', 'femme', 'mk', '2024-06-20 19:08:23', '2024-06-20 19:08:23'),
(13, 'PARKER GOLD', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910598009mk2.png', '195,99', 'femme', 'mk', '2024-06-20 19:09:58', '2024-06-20 19:09:58'),
(14, 'LEXINGTON NUIT', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910650054mk3.png', '195,99', 'femme', 'mk', '2024-06-20 19:10:50', '2024-06-20 19:10:50'),
(15, 'PARKER BICOLORE', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910726070mk4.png', '195,99', 'femme', 'mk', '2024-06-20 19:12:06', '2024-06-20 19:12:06'),
(16, 'CLASSIC DARK SILVER', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910859203armani11.png', '295,99', 'homme', 'armani', '2024-06-20 19:14:19', '2024-06-20 19:14:19'),
(17, 'DIVER NIGHT', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718910966066armani12.png', '285,99', 'homme', 'armani', '2024-06-20 19:16:06', '2024-06-20 19:16:06'),
(18, 'DIVER SILVER GREEN', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911078349armani13.png', '285,99', 'homme', 'armani', '2024-06-20 19:17:58', '2024-06-20 19:17:58'),
(19, 'RENATO BLACK', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911164666armani14.png', '285,99', 'homme', 'armani', '2024-06-20 19:19:24', '2024-06-20 19:19:24'),
(20, 'ADMIRAL BICOLORE', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911221414boss11.png', '185,99', 'homme', 'boss', '2024-06-20 19:20:21', '2024-06-20 19:22:13'),
(21, 'ADMIRAL BLUE', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911317800boss12.png', '195,99', 'homme', 'boss', '2024-06-20 19:21:57', '2024-06-20 19:21:57'),
(22, 'ADMIRAL GREEN', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911535671boss13.png', '185,95', 'homme', 'boss', '2024-06-20 19:25:35', '2024-06-20 19:25:35'),
(23, 'HERO FULL BLACK', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911630335boss14.png', '195,95', 'homme', 'boss', '2024-06-20 19:27:10', '2024-06-20 19:27:10'),
(24, 'THE CITY SILVER', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911767804burberry11.png', '185,95', 'homme', 'burberry', '2024-06-20 19:29:27', '2024-06-20 19:29:27'),
(25, 'THE CITY BICOLORE', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911797357burberry12.png', '195,95', 'homme', 'burberry', '2024-06-20 19:29:57', '2024-06-20 19:29:57'),
(26, 'THE CITY GOLD', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911824055burberry13.png', '199,95', 'homme', 'burberry', '2024-06-20 19:30:24', '2024-06-20 19:30:24'),
(27, 'THE CITY DARK', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911871640burberry14.png', '190,95', 'homme', 'burberry', '2024-06-20 19:31:11', '2024-06-20 19:31:11'),
(28, 'LEXINGTON BICOLORE', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718911953333mk11.png', '190,95', 'homme', 'mk', '2024-06-20 19:32:33', '2024-06-20 19:32:33'),
(29, 'BRADSHAW GOLD BLACK', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718912009462mk12.png', '195,95', 'homme', 'mk', '2024-06-20 19:33:29', '2024-06-20 19:33:29'),
(30, 'BRADSHAW GOLD NUIT', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718912062324mk13.png', '195,95', 'homme', 'mk', '2024-06-20 19:34:22', '2024-06-20 19:34:22'),
(31, 'BRADSHAW BICOLORE', 'Montre pour homme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718912087860mk14.png', '195,95', 'homme', 'mk', '2024-06-20 19:34:47', '2024-06-20 19:34:47'),
(32, 'THE CITY DARK', 'Montre pour femme en acier inoxydable, qui vous permettra de vous offrir un look tendance. Le boîtier de 32mm et l’épaisseur de 8mm.', 'image_1718912277858burberry1.png', '185,95', 'femme', 'burberry', '2024-06-20 19:37:57', '2024-06-20 19:37:57');

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230825144256-create-users.js'),
('20230825151405-create-orders.js'),
('20230825151453-create-order-items.js'),
('20230828182108-create-products.js');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `is_admin`, `createdAt`, `updatedAt`) VALUES
(1, 'ladjoui', 'miriam', 'miriamladjoui@gmail.com', '$2b$10$75tV6qtM/paZ9Jqrbm/O6.boko4KuHkV/7pR8RC/2v9enX4RwNv7K', 1, '2024-06-20 17:49:03', '2024-06-20 17:49:03'),
(2, 'ldj', 'sarah', 'sarah@hotmail.fr', '$2b$10$f2mAJnibJS22uoQOaM5lY.NxT543LGXzcRrnMSDdVmcJsDHYYTt42', 1, '2024-07-26 14:27:10', '2024-07-26 14:27:10');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
