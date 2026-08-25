import { FiAlertCircle, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { Badge, Button, IconButton, PanelHeader } from "@/app/components/ui";
import type { Point } from "../lib/mock-data";

type SprintPointsPanelProps = {
	points: Point[];
	newPoint: string;
	onNewPointChange: (value: string) => void;
	onAdd: () => void;
	onRemove: (id: string) => void;
	onCalculate: () => void;
	notice: string;
};

export function SprintPointsPanel({
	points,
	newPoint,
	onNewPointChange,
	onAdd,
	onRemove,
	onCalculate,
	notice,
}: SprintPointsPanelProps) {
	return (
		<section className="panel sprint-panel">
			<PanelHeader
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
				{points.map((point) => (
					<div className="point-chip" key={point.id}>
						<span>{point.value}</span>
						<IconButton
							label={`Eliminar ${point.value} puntos`}
							onClick={() => onRemove(point.id)}
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
