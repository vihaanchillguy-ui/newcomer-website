CREATE TABLE `announcementSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `announcementSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `announcementSubscribers_email_unique` UNIQUE(`email`)
);
