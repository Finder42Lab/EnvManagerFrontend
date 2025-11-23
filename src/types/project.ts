import type { IIdNameSchema } from './common.ts'

export interface IProject extends IIdNameSchema {
	description?: string
}

export interface IProjectFull extends IIdNameSchema {
	description?: string
	includes: string[]
	group?: IIdNameSchema
}

export interface IProjectGroup {
	id: string
	name: string

	projects: IProject[]
}
