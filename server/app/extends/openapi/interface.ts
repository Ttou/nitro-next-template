import type { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export type ISchema = SchemaObject & Partial<ReferenceObject>
