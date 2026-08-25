"use client";

import { useState } from "react";
import { AppHeader, PageFooter, PageIntro } from "@/app/components/app-layout";
import { EquivalencePanel } from "@/app/components/equivalence-panel";
import { ResultsModal } from "@/app/components/results-modal";
import { SprintPointsPanel } from "@/app/components/sprint-points-panel";
import {
	calculateSprint,
	initialEquivalences,
	initialSprintPoints,
	type Point,
	type PointEquivalence,
	type SprintResult,
} from "@/app/lib/mock-data";
import pkg from "./../../package.json";

export default function SprintPlanner() {
	const [equivalences, setEquivalences] =
		useState<PointEquivalence[]>(initialEquivalences);
	const [sprintPoints, setSprintPoints] =
		useState<Point[]>(initialSprintPoints);
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
		const insertPoint = {
			id: crypto.randomUUID(),
			value: Number(newPoint),
		};
		const isKnownPoint = equivalences.some(
			(equivalence) => equivalence.points === insertPoint.value,
		);
		if (
			!newPoint.trim() ||
			!Number.isFinite(insertPoint.value) ||
			insertPoint.value <= 0
		) {
			setNotice("Escribe un numero de puntos mayor que cero.");
			return;
		}
		if (!isKnownPoint) {
			setNotice(
				"Ese punto no tiene equivalencia. Usa uno de los valores de la escala.",
			);
			return;
		}
		setSprintPoints((current) => [...current, insertPoint]);
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
			<AppHeader version={`v${pkg.version}`} />
			<PageIntro itemCount={sprintPoints.length} />
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
					onRemove={(id) =>
						setSprintPoints((current) => current.filter((a) => id !== a.id))
					}
					onCalculate={handleCalculate}
					notice={notice}
				/>
			</div>
			<PageFooter>
				{/* <FruitList fruits={fruits} error={error} /> */}
			</PageFooter>
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
