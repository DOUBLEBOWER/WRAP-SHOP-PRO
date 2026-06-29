CREATE TABLE `portfolio_items` (
	`id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255),
	`featured` boolean NOT NULL DEFAULT false,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_items_id` PRIMARY KEY(`id`)
);
