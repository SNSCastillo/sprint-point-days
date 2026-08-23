import { type FetchConfig, ResponseFailError } from "./fetch";

export const apiClient = async <T>(options: FetchConfig): Promise<T> => {
	const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

	const response = await fetch(`${BASE_URL}${options.path}`, {
		method: options.method,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		body: options.data ? JSON.stringify(options.data) : undefined,
	});

	if (!response.ok) {
		const errorTexto = await response.text().catch(() => "Error");
		throw new ResponseFailError(
			"ResponseFailError",
			`Error: ${errorTexto}`,
			response,
		);
	}

	if (response.status === 204) return undefined as T;
	return await response.json();
};
