"use client";

import { useEffect, useState } from "react";
import { AppHeader, PageFooter, PageIntro } from "@/app/components/app-layout";
import { EquivalencePanel } from "@/app/components/equivalence-panel";
import { FruitList } from "@/app/components/fruit-list";
import { ResultsModal } from "@/app/components/results-modal";
import { SprintPointsPanel } from "@/app/components/sprint-points-panel";
import { isApiError } from "@/app/lib/api/fetch";
import { getListFruits } from "@/app/lib/api/fruits/endpoints";
import type { Fruit } from "@/app/lib/api/fruits/types";
import {
	calculateSprint,
	initialEquivalences,
	initialSprintPoints,
	type PointEquivalence,
	type SprintResult,
} from "@/app/lib/mock-data";

export default function SprintPlanner() {
	const [equivalences, setEquivalences] =
		useState<PointEquivalence[]>(initialEquivalences);
	const [sprintPoints, setSprintPoints] =
		useState<number[]>(initialSprintPoints);
	const [newPoint, setNewPoint] = useState("");
	const [notice, setNotice] = useState("");
	const [results, setResults] = useState<SprintResult[] | null>(null);
	const [fruits, setFruits] = useState<Fruit[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadFruits() {
			try {
				setFruits(await getListFruits());
			} catch (err) {
				if (isApiError(err))
					setError(
						`Error del servidor (${err.response.status}): ${err.message}`,
					);
				else setError("Error de conexión a internet");
			}
		}
		loadFruits();
	}, []);

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
			<AppHeader />
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
					onRemove={(index) =>
						setSprintPoints((current) =>
							current.filter((_, itemIndex) => itemIndex !== index),
						)
					}
					onCalculate={handleCalculate}
					notice={notice}
				/>
			</div>
			<PageFooter>
				<FruitList fruits={fruits} error={error} />
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
