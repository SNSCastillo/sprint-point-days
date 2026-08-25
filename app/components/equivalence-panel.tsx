import { FiEdit3 } from "react-icons/fi";
import { Badge, PanelHeader } from "@/app/components/ui";
import type { PointEquivalence } from "@/app/lib/mock-data";

type EquivalencePanelProps = {
	equivalences: PointEquivalence[];
	onUpdate: (id: string, field: "points" | "days", value: string) => void;
};

export function EquivalencePanel({
	equivalences,
	onUpdate,
}: EquivalencePanelProps) {
	return (
		<section className="panel equivalence-panel">
			<PanelHeader
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
