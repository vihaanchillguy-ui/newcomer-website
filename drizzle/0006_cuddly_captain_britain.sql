CREATE TABLE `accountRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accountRegistrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `accountRegistrations_email_unique` UNIQUE(`email`)
);
