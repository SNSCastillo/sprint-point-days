import type { ReactNode } from "react";
import { SiGithub } from "react-icons/si";

export function AppHeader({
	version = "v0.1",
	url,
}: {
	version?: string;
	url?: string;
}) {
	return (
		<header className="topbar">
			<div className="brand">
				<span className="brand-mark">SP</span>
				<span>
					SPRINT
					<br />
					<strong>PLANNER</strong>
				</span>
			</div>
			<div className="topbar-context">
				<span className="status-dot" />
				{version}
				<span className="divider" />
				<span className="github-link">
					<a href={url} target="_blank" rel="noopener noreferrer">
						<SiGithub size={15} />
					</a>
				</span>
			</div>
		</header>
	);
}

export function PageIntro({ itemCount }: { itemCount: number }) {
	return (
		<section className="page-intro">
			<div>
				<h1>
					Convierte puntos
					<br />
					<em>en dias claros.</em>
				</h1>
				<p className="intro-copy">
					Define tu escala de trabajo, carga los puntos del sprint y obtén una
					estimación lista para compartir.
				</p>
			</div>
			<div className="intro-stamp">
				<span>SPRINT</span>
				<strong>{itemCount.toString().padStart(2, "0")}</strong>
				<small>items cargados</small>
			</div>
		</section>
	);
}

export function PageFooter({
	children,
	primaryLabel = "ESTIMACION DE SPRINT",
	secondaryLabel = "Los cambios se mantienen en esta sesion",
}: {
	children?: ReactNode;
	primaryLabel?: string;
	secondaryLabel?: string;
}) {
	return (
		<footer className="page-footer">
			<span>{primaryLabel}</span>
			<span>{secondaryLabel}</span>
			{children}
		</footer>
	);
}
