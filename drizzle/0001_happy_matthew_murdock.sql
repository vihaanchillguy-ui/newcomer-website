CREATE TABLE `galleryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text NOT NULL,
	`mediaType` enum('image','video') NOT NULL DEFAULT 'image',
	`published` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`imageUrl` text NOT NULL,
	`published` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`price` varchar(32) NOT NULL,
	`currency` varchar(8) NOT NULL,
	`platform` varchar(120) NOT NULL,
	`availability` varchar(120) NOT NULL,
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentKey` varchar(64) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteContent_contentKey_unique` UNIQUE(`contentKey`)
);
--> statement-breakpoint
CREATE TABLE `supportMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(180) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','in_progress','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supportMessages_id` PRIMARY KEY(`id`)
);
