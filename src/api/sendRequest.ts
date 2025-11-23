export class RequestError extends Error {
	public data?: Record<string, unknown>
	constructor(data?: Record<string, unknown>) {
		super()
		this.data = data
	}
}

interface ISendRequestOptions {
	host: string
	url: string
	method: 'GET' | 'POST' | 'DELETE' | 'PUT'
	subdomain?: string
	data?: Record<string, unknown>
	secure?: boolean
}

export function sendRequest<T = unknown>({
	host,
	url,
	method,
	subdomain,
	data,
	secure,
}: ISendRequestOptions): Promise<T> {
	let _base = host

	if (subdomain) {
		_base = `${subdomain}.${_base}`
	}

	url = url.replaceAll(/[{][a-zA-Z0-9_]+[}]/gm, (substring) => {
		const field = substring.replace(/[{}]/gm, '')
		if (data && field in data) {
			const val = data[field]
			delete data[field]
			return val?.toString() ?? ''
		}
		return ''
	})

	const _url = new URL(url, `http${secure ? 's' : ''}://${_base}`)

	if (method === 'GET' && data) {
		for (const [key, value] of Object.entries(data)) {
			_url.searchParams.append(key, value + '')
		}
	}

	const requestOptions: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: localStorage.getItem('access_token') || '',
		},
		credentials: 'include',
		body: method !== 'GET' ? JSON.stringify(data) : undefined,
	}

	return fetch(_url.toString(), requestOptions)
		.then(async (response) => {
			if (!response.ok) {
				throw new RequestError((await response.json()).detail)
			}
			return response.json()
		})
		.catch((error) => {
			console.error('Error during fetch:', error)
			throw error
		})
}
