import { Newable } from './type.interface';
import 'reflect-metadata';

interface depsInterface {
  hostId: string;
  tokens: symbol[];
}

export class Container {
  private static instances = new Map<string | symbol, any>();
  private static bindingMap = new Map<string | symbol, Newable<any>>();

  static bind<T>(
    token: string | symbol,
    classToInject: Newable<T>,
    scope: 'singleton' | 'common' = 'singleton',
  ) {
    Reflect.defineMetadata('scope', scope, classToInject);
    Container.bindingMap.set(token, classToInject);
  }

  static unbind(token: string | symbol) {
    if (Container.bindingMap.has(token)) {
      Container.bindingMap.delete(token);

      if (Container.instances.has(token)) {
        Container.instances.delete(token);
      }
    } else {
      throw new Error('There are no objects with specified token to unbind');
    }
  }

  static resolve<T>(token: string | symbol): T {
    const template: Newable<T> = Container.bindingMap.get(token);
    if (!template) {
      throw new Error(`Container does not contain an object with token ${String(token)}`);
    }
    const scope = Reflect.getMetadata('scope', template);
    if (Container.instances.has(token)) {
      return Container.instances.get(token);
    }
    const depsInfo: depsInterface = Reflect.getMetadata('dependencies', template);
    const injections = depsInfo.tokens.map((t): any => {
      return Container.resolve(t);
    });
    const instance = new template(...injections.reverse());
    if (scope != 'singleton') {
      return instance;
    }
    Container.instances.set(token, instance);
    return instance;
  }
}
