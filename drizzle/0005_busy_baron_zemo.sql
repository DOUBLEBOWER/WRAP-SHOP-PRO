CREATE TABLE `tenant_settings` (
	`id` varchar(64) NOT NULL,
	`tenantId` varchar(64) NOT NULL,
	`taxRate` decimal(5,2) NOT NULL DEFAULT '8.5',
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`invoicePrefix` varchar(16) NOT NULL DEFAULT 'INV',
	`invoiceStartNumber` int NOT NULL DEFAULT 1000,
	`notificationEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenant_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenant_settings_tenantId_unique` UNIQUE(`tenantId`)
);
--> statement-breakpoint
CREATE TABLE `tenant_users` (
	`id` varchar(64) NOT NULL,
	`tenantId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','admin','user') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tenant_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` varchar(64) NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`website` varchar(255),
	`logoUrl` text,
	`logoKey` varchar(255),
	`primaryColor` varchar(7) DEFAULT '#0891b2',
	`secondaryColor` varchar(7) DEFAULT '#ec4899',
	`invoiceTemplate` json,
	`subscriptionStatus` enum('trial','active','paused','canceled') NOT NULL DEFAULT 'trial',
	`subscriptionPlan` varchar(32) NOT NULL DEFAULT 'starter',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`trialEndsAt` timestamp,
	`renewalDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_email_unique` UNIQUE(`email`)
);
