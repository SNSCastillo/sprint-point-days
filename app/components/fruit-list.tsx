import type { Fruit } from "@/app/lib/api/fruits/types";

export function FruitList({
	fruits,
	error,
}: {
	fruits: Fruit[];
	error?: string | null;
}) {
	return (
		<section aria-labelledby="fruit-list-title">
			<h2 id="fruit-list-title">Lista de Frutas</h2>
			{error ? (
				<p role="alert">{error}</p>
			) : (
				<p> {`Item consultados (test api): ${fruits.length}`}</p>
			)}
		</section>
	);
}
