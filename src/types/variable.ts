import type { IIdNameSchema } from './common.ts'

export interface IVariable extends IIdNameSchema {
	value: string
	project: IIdNameSchema
	is_secret: boolean
}
