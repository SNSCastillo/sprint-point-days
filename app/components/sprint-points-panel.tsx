import { FiAlertCircle, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { Badge, Button, IconButton, PanelHeader } from "@/app/components/ui";
import type { Point, PointEquivalence } from "../lib/mock-data";

type SprintPointsPanelProps = {
  points: Point[];
  equivalences: PointEquivalence[];
  onAdd: (value: number) => void;
  onRemove: (id: string) => void;
  onCalculate: () => void;
  notice: string;
};

export function SprintPointsPanel({
  points,
  equivalences,
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
      <fieldset className="point-options" aria-label="Puntos disponibles">
        <legend className="field-label">SELECCIONA Y AGREGA LOS PUNTOS</legend>
        {equivalences.map((equivalence) => (
          <button
            className="point-option"
            key={equivalence.id}
            type="button"
            onClick={() => onAdd(equivalence.points)}
          >
            <FiPlus aria-hidden="true" />
            <span>{equivalence.points}</span>
          </button>
        ))}
      </fieldset>
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
