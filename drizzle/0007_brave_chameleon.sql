ALTER TABLE `accountRegistrations` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `accountRegistrations` ADD `role` enum('user','admin') DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `accountRegistrations` ADD `sessionTokenHash` varchar(128);--> statement-breakpoint
ALTER TABLE `accountRegistrations` ADD `sessionExpiresAt` timestamp;