export type PointEquivalence = {
	id: string;
	points: number;
	days: number;
};

export type SprintResult = {
	id: string;
	points: number;
	days: number;
};

export type Point = {
	id: string;
	value: number;
};

export const initialEquivalences: PointEquivalence[] = [
	{ id: "eq-1", points: 1, days: 0.125 },
	{ id: "eq-3", points: 3, days: 0.5 },
	{ id: "eq-5", points: 5, days: 1 },
	{ id: "eq-8", points: 8, days: 2 },
	{ id: "eq-13", points: 13, days: 3 },
];

export const initialSprintPoints: Point[] = [
	{
		id: crypto.randomUUID(),
		value: 1,
	},
	{
		id: crypto.randomUUID(),
		value: 5,
	},
];

// TODO: sustituir estos mocks por GET /api/point-equivalences y GET /api/sprints/:id.
export function calculateSprint(
	points: Point[],
	equivalences: PointEquivalence[],
): SprintResult[] {
	return points.map((point) => {
		const exactMatch = equivalences.find(
			(equivalence) => equivalence.points === point.value,
		);

		if (!exactMatch) {
			throw new Error(`No existe una equivalencia para ${point} puntos.`);
		}

		return { id: point.id, points: point.value, days: exactMatch.days };
	});
}
