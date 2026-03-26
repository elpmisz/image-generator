CREATE TABLE `generations` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`prompt` text NOT NULL,
	`character_images` text,
	`element_images` text,
	`overrides` text,
	`image_url` text,
	`status` text NOT NULL,
	`error` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `prompt_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prompt_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`prompt_text` text NOT NULL,
	`style` text NOT NULL,
	`lighting` text,
	`mood` text,
	`action` text,
	`camera` text,
	`color_palette` text,
	`aspect_ratio` text NOT NULL,
	`quality` text NOT NULL,
	`negative_prompt` text,
	`example_image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);