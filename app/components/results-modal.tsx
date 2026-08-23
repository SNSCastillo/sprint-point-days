import { Button, IconButton } from "@/app/components/ui";
import type { SprintResult } from "@/app/lib/mock-data";

const numberFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 3,
});
type ResultsModalProps = {
	results: SprintResult[];
	onClose: () => void;
	onReset: () => void;
};

export function ResultsModal({ results, onClose, onReset }: ResultsModalProps) {
	const totalDays = results.reduce((total, result) => total + result.days, 0);
	return (
		<dialog
			className="modal-backdrop"
			open
			onClick={(event) => event.target === event.currentTarget && onClose()}
			onKeyDown={(event) => event.key === "Escape" && onClose()}
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
					Tu sprint necesita{" "}
					<strong>{numberFormatter.format(totalDays)} dias</strong>
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
							<strong>{numberFormatter.format(result.days)} dias</strong>
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
