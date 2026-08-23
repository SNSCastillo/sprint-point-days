import { apiClient } from "../api-client";
import type { Fruit } from "./types";

export const getListFruits = () => {
	return apiClient<Fruit[]>({
		method: "GET",
		path: "/v2/fruits/fr",
	});
};
