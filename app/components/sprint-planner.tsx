"use client";

import { useState } from "react";
import { FiAlertCircle, FiArrowUpRight, FiEdit3, FiPlus } from "react-icons/fi";
import { Badge, Button, IconButton, PanelHeader } from "@/app/components/ui";
import {
	calculateSprint,
	initialEquivalences,
	initialSprintPoints,
	type PointEquivalence,
	type SprintResult,
} from "@/app/lib/mock-data";

const numberFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 3,
});

function formatDays(days: number): string {
	return numberFormatter.format(days);
}

function EquivalencePanel({
	equivalences,
	onUpdate,
}: {
	equivalences: PointEquivalence[];
	onUpdate: (id: string, field: "points" | "days", value: string) => void;
}) {
	return (
		<section className="panel equivalence-panel">
			<PanelHeader
				label="A"
				title="Escala de equivalencias"
				description="Tu referencia para estimar esfuerzo."
			>
				<Badge>MOCK DATA</Badge>
			</PanelHeader>
			<div className="table-head">
				<span>PUNTOS</span>
				<span>EQUIVALE A</span>
				<span>DIAS</span>
			</div>
			<div className="equivalence-list">
				{equivalences.map((equivalence) => (
					<div className="equivalence-row" key={equivalence.id}>
						<input
							aria-label={`Puntos para ${equivalence.id}`}
							type="number"
							min="0.1"
							step="0.1"
							value={equivalence.points}
							onChange={(event) =>
								onUpdate(equivalence.id, "points", event.target.value)
							}
						/>
						<span className="equals">=</span>
						<input
							aria-label={`Dias para ${equivalence.id}`}
							type="number"
							min="0.01"
							step="0.125"
							value={equivalence.days}
							onChange={(event) =>
								onUpdate(equivalence.id, "days", event.target.value)
							}
						/>
						<span className="unit">dias</span>
					</div>
				))}
			</div>
			<p className="panel-footnote">
				<FiEdit3 aria-hidden="true" /> Puedes editar cualquier valor antes de
				calcular.
			</p>
		</section>
	);
}

function SprintPointsPanel({
	points,
	newPoint,
	onNewPointChange,
	onAdd,
	onRemove,
	onCalculate,
	notice,
}: {
	points: number[];
	newPoint: string;
	onNewPointChange: (value: string) => void;
	onAdd: () => void;
	onRemove: (index: number) => void;
	onCalculate: () => void;
	notice: string;
}) {
	return (
		<section className="panel sprint-panel">
			<PanelHeader
				label="B"
				title="Puntos del sprint"
				description="La lista que vas a estimar."
			>
				<Badge variant="accent">
					{points.length} {points.length === 1 ? "item" : "items"}
				</Badge>
			</PanelHeader>
			<label className="field-label" htmlFor="new-point">
				INGRESA TUS PUNTOS
			</label>
			<div className="point-input-row">
				<input
					id="new-point"
					type="number"
					min="0.1"
					step="0.1"
					placeholder="Ej. 8"
					value={newPoint}
					onChange={(event) => onNewPointChange(event.target.value)}
					onKeyDown={(event) => event.key === "Enter" && onAdd()}
				/>
				<Button variant="secondary" type="button" onClick={onAdd}>
					<FiPlus aria-hidden="true" /> Insertar
				</Button>
			</div>
			<div className="chips" aria-live="polite">
				{points.map((point, index) => (
					<div className="point-chip" key={point}>
						<span>{point}</span>
						<IconButton
							label={`Eliminar ${point} puntos`}
							onClick={() => onRemove(index)}
						/>
					</div>
				))}
			</div>
			<div className="sprint-divider" />
			<Button className="calculate-button" type="button" onClick={onCalculate}>
				<FiArrowUpRight aria-hidden="true" /> Calcular dias del sprint
			</Button>
			{notice && (
				<div className="notice" role="alert">
					<FiAlertCircle aria-hidden="true" />
					{notice}
				</div>
			)}
			<p className="helper-text">
				La estimacion usa la equivalencia exacta o el valor de referencia mas
				cercano.
			</p>
		</section>
	);
}

function ResultsModal({
	results,
	onClose,
	onReset,
}: {
	results: SprintResult[];
	onClose: () => void;
	onReset: () => void;
}) {
	const totalDays = results.reduce((total, result) => total + result.days, 0);

	return (
		<dialog
			className="modal-backdrop"
			open
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") onClose();
			}}
		>
			<section
				className="result-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="result-title"
			>
				<IconButton
					label="Cerrar resultados"
					className="modal-close"
					onClick={onClose}
				/>
				<p className="eyebrow">RESULTADO DEL CALCULO</p>
				<h2 id="result-title">
					Tu sprint necesita <strong>{formatDays(totalDays)} dias</strong>
				</h2>
				<p className="modal-copy">
					Esta es la equivalencia estimada para los {results.length} puntos que
					cargaste.
				</p>
				<div className="result-list">
					{results.map((result) => (
						<div className="result-row" key={`${result.points}-${result.days}`}>
							<span>
								<b>{result.points}</b> puntos
							</span>
							<strong>{formatDays(result.days)} dias</strong>
						</div>
					))}
				</div>
				<div className="modal-actions">
					<Button onClick={onClose}>Seguir editando</Button>
					<Button variant="quiet" onClick={onReset}>
						Iniciar de nuevo
					</Button>
				</div>
			</section>
		</dialog>
	);
}

export default function SprintPlanner() {
	const [equivalences, setEquivalences] =
		useState<PointEquivalence[]>(initialEquivalences);
	const [sprintPoints, setSprintPoints] =
		useState<number[]>(initialSprintPoints);
	const [newPoint, setNewPoint] = useState("");
	const [notice, setNotice] = useState("");
	const [results, setResults] = useState<SprintResult[] | null>(null);

	const updateEquivalence = (
		id: string,
		field: "points" | "days",
		value: string,
	) => {
		const parsedValue = Number(value);
		setEquivalences((current) =>
			current.map((item) =>
				item.id === id ? { ...item, [field]: parsedValue } : item,
			),
		);
	};

	const addPoint = () => {
		const parsedPoint = Number(newPoint);
		const isKnownPoint = equivalences.some(
			(equivalence) => equivalence.points === parsedPoint,
		);
		if (!newPoint.trim() || !Number.isFinite(parsedPoint) || parsedPoint <= 0) {
			setNotice("Escribe un numero de puntos mayor que cero.");
			return;
		}
		if (!isKnownPoint) {
			setNotice(
				"Ese punto no tiene equivalencia. Usa uno de los valores de la escala.",
			);
			return;
		}
		setSprintPoints((current) => [...current, parsedPoint]);
		setNewPoint("");
		setNotice("");
	};

	const handleCalculate = () => {
		if (sprintPoints.length === 0) {
			setNotice("Agrega al menos un punto para calcular el sprint.");
			return;
		}
		setResults(calculateSprint(sprintPoints, equivalences));
		setNotice("");
	};

	return (
		<>
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
					<span className="status-dot" /> Datos locales{" "}
					<span className="divider" /> v0.1
				</div>
			</header>
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
					<strong>{sprintPoints.length.toString().padStart(2, "0")}</strong>
					<small>items cargados</small>
				</div>
			</section>
			<div className="workspace-grid">
				<EquivalencePanel
					equivalences={equivalences}
					onUpdate={updateEquivalence}
				/>
				<SprintPointsPanel
					points={sprintPoints}
					newPoint={newPoint}
					onNewPointChange={setNewPoint}
					onAdd={addPoint}
					onRemove={(index) =>
						setSprintPoints((current) =>
							current.filter((_, itemIndex) => itemIndex !== index),
						)
					}
					onCalculate={handleCalculate}
					notice={notice}
				/>
			</div>
			<footer className="page-footer">
				<span>ESTIMACION DE SPRINT</span>
				<span>Los cambios se mantienen en esta sesion</span>
			</footer>
			{results && (
				<ResultsModal
					results={results}
					onClose={() => setResults(null)}
					onReset={() => {
						setResults(null);
						setSprintPoints([]);
					}}
				/>
			)}
		</>
	);
}
