CREATE TABLE `playerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`handle` varchar(40) NOT NULL DEFAULT '',
	`bio` text NOT NULL,
	`favoriteArea` varchar(120) NOT NULL DEFAULT '',
	`notifications` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `playerProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `playerProfiles_email_unique` UNIQUE(`email`)
);
***
