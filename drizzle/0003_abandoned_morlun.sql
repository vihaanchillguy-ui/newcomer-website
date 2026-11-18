CREATE TABLE `wheelEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entryDate` varchar(10) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wheelEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `wheelEntries_user_date_idx` UNIQUE(`userId`,`entryDate`)
);
--> statement-breakpoint
CREATE TABLE `wheelWinners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`winnerDate` varchar(10) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`prize` varchar(160) NOT NULL DEFAULT 'NEWCOMER game key',
	`fulfilled` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`fulfilledAt` timestamp,
	CONSTRAINT `wheelWinners_id` PRIMARY KEY(`id`),
	CONSTRAINT `wheelWinners_winnerDate_unique` UNIQUE(`winnerDate`)
);
