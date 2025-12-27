export async function postJson<T>(url: string, body: unknown) {
	const res = await fetch(url, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
	});

	const text = await res.text();
	const json = text ? JSON.parse(text) : null;

	return { res, json: json as T };
}
