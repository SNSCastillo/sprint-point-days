import type { ButtonHTMLAttributes, ReactNode } from "react";

import { FiX } from "react-icons/fi";

type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	children: ReactNode;
};

export function Button({
	variant = "primary",
	className = "",
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`button button-${variant} ${className}`.trim()}
			{...props}
		>
			{children}
		</button>
	);
}

type BadgeProps = {
	children: ReactNode;
	variant?: "default" | "accent";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
	return <span className={`badge badge-${variant}`}>{children}</span>;
}

type PanelHeaderProps = {
	title: string;
	description: string;
	children?: ReactNode;
};

export function PanelHeader({
	title,
	description,
	children,
}: PanelHeaderProps) {
	return (
		<div className="panel-heading">
			<div className="panel-heading-content">
				<div>
					<h2>{title}</h2>
					<p>{description}</p>
				</div>
			</div>
			{children}
		</div>
	);
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	label: string;
	children?: ReactNode;
};

export function IconButton({
	label,
	children = <FiX aria-hidden="true" />,
	...props
}: IconButtonProps) {
	return (
		<button className="icon-button" type="button" aria-label={label} {...props}>
			{children}
		</button>
	);
}
