import 'reflect-metadata';
import { v4 } from 'uuid';

export function Injectable() {
  return function (target: Function) {
    const deps = Reflect.getMetadataKeys(target);
    let tokens: Array<symbol> = [];
    for (const dep of deps) {
      const token = Reflect.getMetadata(dep, target);
      tokens.push(token);
      Reflect.deleteMetadata(dep, target);
    }
    tokens.shift();

    const depsTree = {
      hostId: target.name,
      tokens,
    };

    Reflect.defineMetadata('dependencies', depsTree, target);
  };
}

export function Inject(token: string | symbol) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const tokenWithPosition = token;

    Reflect.defineMetadata(String(v4()), tokenWithPosition, target);
  };
}
