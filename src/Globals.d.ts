type stepDefinition = (...args: any[]) => void;
type stepExpression = string | RegExp;

export function Given(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function When(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function Then(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function And(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function But(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function given(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function when(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function then(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function and(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function but(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
export function step(  stepExpression: stepExpression,  stepDefinition:  stepDefinition): void;
