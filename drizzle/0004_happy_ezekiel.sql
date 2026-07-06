CREATE TABLE `team_members` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(64) NOT NULL,
	`pin` varchar(64) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
