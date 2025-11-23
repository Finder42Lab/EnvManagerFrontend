import { sendRequest } from './sendRequest.ts'
import type {
	IIdNameSchema,
	IProject,
	IProjectFull,
	IProjectGroup,
	IVariable,
} from '../types'
import type { IWriteGroup, IWriteProject, IWriteVariable } from './types.ts'

const HOST = import.meta.env.VITE_API_HOST

export async function getProjectGroups() {
	return await sendRequest<IProjectGroup[]>({
		host: HOST,
		url: '/api/v1/projects/',
		method: 'GET',
	})
}

export async function retrieveProject(projectId: string) {
	return await sendRequest<IProjectFull>({
		host: HOST,
		url: `/api/v1/projects/${projectId}/`,
		method: 'GET',
	})
}

export async function getProjectFreeParents(projectId?: string) {
	return await sendRequest<IProject[]>({
		host: HOST,
		url: `/api/v1/projects/free/`,
		method: 'GET',
		data: {
			project_id: projectId,
		},
	})
}

export async function writeProject(body: IWriteProject) {
	return await sendRequest<string>({
		host: HOST,
		url: '/api/v1/projects/',
		method: 'POST',
		// @ts-expect-error ругается на типы
		data: body,
	})
}

export async function deleteProject(projectId: string) {
	return await sendRequest<{ error: string }>({
		host: HOST,
		url: `/api/v1/projects/${projectId}/`,
		method: 'DELETE',
	})
}

export async function getVariables(projectId: string) {
	return await sendRequest<IVariable[]>({
		host: HOST,
		url: '/api/v1/variables/?project_id=' + projectId,
		method: 'GET',
	})
}

export async function retrieveVariable(variableId: string) {
	return await sendRequest<IVariable>({
		host: HOST,
		url: `/api/v1/variables/${variableId}/`,
		method: 'GET',
	})
}

export async function writeVariable(variable: IWriteVariable) {
	return await sendRequest<IVariable>({
		host: HOST,
		url: '/api/v1/variables/',
		method: 'POST',
		// @ts-expect-error ругается на типы
		data: variable,
	})
}

export async function deleteVariable(variableId: string) {
	return await sendRequest<IVariable>({
		host: HOST,
		url: `/api/v1/variables/${variableId}`,
		method: 'DELETE',
	})
}

export async function getGroups() {
	return await sendRequest<IIdNameSchema[]>({
		host: HOST,
		url: `/api/v1/groups/`,
		method: 'GET',
	})
}

export async function retrieveGroup(groupId: string) {
	return await sendRequest<IIdNameSchema>({
		host: HOST,
		url: `/api/v1/groups/${groupId}/`,
		method: 'GET',
	})
}

export async function writeGroup(body: IWriteGroup) {
	return await sendRequest<string>({
		host: HOST,
		url: '/api/v1/groups/',
		method: 'POST',
		// @ts-expect-error ругается на типы
		data: body,
	})
}

export async function deleteGroup(groupId: string) {
	return await sendRequest<{ error: string }>({
		host: HOST,
		url: `/api/v1/groups/${groupId}/`,
		method: 'DELETE',
	})
}
