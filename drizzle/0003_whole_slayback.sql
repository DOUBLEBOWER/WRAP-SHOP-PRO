DROP TABLE `design_approvers`;--> statement-breakpoint
DROP TABLE `design_comments`;--> statement-breakpoint
ALTER TABLE `design_approvals` ADD `clientEmail` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `design_approvals` ADD `clientName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `design_approvals` ADD `approvalToken` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `design_approvals` ADD `feedback` text;--> statement-breakpoint
ALTER TABLE `design_approvals` ADD CONSTRAINT `design_approvals_approvalToken_unique` UNIQUE(`approvalToken`);