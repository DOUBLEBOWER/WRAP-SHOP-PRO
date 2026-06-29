CREATE TABLE `design_approvals` (
	`id` varchar(64) NOT NULL,
	`dealId` varchar(64) NOT NULL,
	`designImageUrl` text NOT NULL,
	`designName` varchar(255) NOT NULL,
	`status` enum('pending','approved','rejected','revisions_requested') NOT NULL DEFAULT 'pending',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `design_approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `design_approvers` (
	`id` varchar(64) NOT NULL,
	`approvalId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','approved','rejected','revisions_requested') NOT NULL DEFAULT 'pending',
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `design_approvers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `design_comments` (
	`id` varchar(64) NOT NULL,
	`approvalId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`comment` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `design_comments_id` PRIMARY KEY(`id`)
);
