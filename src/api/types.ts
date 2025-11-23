export interface IWriteGroup {
	id?: string
	name: string
}

export interface IWriteProject {
	id?: string
	name: string
	description?: string
	includes: string[]
	group_id: string
}

export interface IWriteVariable {
	id?: string
	name: string
	value?: string
	is_secret?: boolean
	project_id?: string
}

export interface IVariableBulkCreateRequest {
	project_id: string
	variables_text: string
}
