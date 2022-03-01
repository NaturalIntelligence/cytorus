export interface IParameterTypeDefinition<T> {
    name: string
    regexp: readonly RegExp[] | readonly string[] | RegExp | string
    transformer: (...match: string[]) => T
    useForSnippets?: boolean
    preferForRegexpMatch?: boolean
}

export function defineParameterType(  options: IParameterTypeDefinition<any>): void;
