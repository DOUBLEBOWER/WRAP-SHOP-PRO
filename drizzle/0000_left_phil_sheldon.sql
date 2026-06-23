CREATE TABLE `calendar_events` (
	`id` varchar(64) NOT NULL,
	`dealId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`customerName` varchar(255) NOT NULL DEFAULT '',
	`type` varchar(32) NOT NULL DEFAULT 'installation',
	`start` varchar(32) NOT NULL,
	`end` varchar(32) NOT NULL,
	`assignedTech` varchar(255) NOT NULL DEFAULT '',
	`status` varchar(32) NOT NULL DEFAULT 'scheduled',
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL DEFAULT 'Personal Custom',
	`email` varchar(320) NOT NULL DEFAULT '',
	`phone` varchar(64) NOT NULL DEFAULT '',
	`address` text,
	`totalSpent` decimal(10,2) NOT NULL DEFAULT '0',
	`notes` text,
	`createdAt` varchar(32) NOT NULL,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` varchar(64) NOT NULL,
	`customerId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`serviceType` varchar(64) NOT NULL,
	`value` decimal(10,2) NOT NULL DEFAULT '0',
	`stage` varchar(32) NOT NULL DEFAULT 'inquiry',
	`specs` json,
	`dueDate` varchar(32) NOT NULL DEFAULT '',
	`notes` text,
	`assignedTo` varchar(255),
	`vinylUsed` varchar(255),
	`workDetails` text,
	`comments` json,
	`proofUrl` text,
	`proofStatus` varchar(32),
	`proofNotes` text,
	`updatedAt` varchar(32) NOT NULL,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` varchar(64) NOT NULL,
	`brand` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`colorCode` varchar(16) NOT NULL DEFAULT '#000000',
	`finish` varchar(32) NOT NULL DEFAULT 'Gloss',
	`sqFtTotal` int NOT NULL DEFAULT 0,
	`sqFtUsed` int NOT NULL DEFAULT 0,
	`sqFtRemaining` int NOT NULL DEFAULT 0,
	`costPerSqFt` decimal(8,2) NOT NULL DEFAULT '0',
	`minAlertThreshold` int NOT NULL DEFAULT 50,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(64) NOT NULL,
	`customerId` varchar(64) NOT NULL,
	`dealId` varchar(64),
	`invoiceNumber` varchar(64) NOT NULL,
	`type` varchar(16) NOT NULL DEFAULT 'invoice',
	`status` varchar(32) NOT NULL DEFAULT 'draft',
	`items` json NOT NULL,
	`subtotal` decimal(10,2) NOT NULL DEFAULT '0',
	`taxRate` decimal(5,2) NOT NULL DEFAULT '8.5',
	`taxAmount` decimal(10,2) NOT NULL DEFAULT '0',
	`discount` decimal(10,2) NOT NULL DEFAULT '0',
	`total` decimal(10,2) NOT NULL DEFAULT '0',
	`issueDate` varchar(32) NOT NULL,
	`dueDate` varchar(32) NOT NULL,
	`notes` text,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
