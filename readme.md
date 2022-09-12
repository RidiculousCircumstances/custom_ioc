# Inversion-tools
A lightweight library for fast dependency injection to your project.

---

##Basic features

To start using IoC Container just import it:
```
import { Container } from 'inversion-tools';
```

The container binds the class you want and the token, which can be a string or a symbol:

```
//main.ts
import { Container } from 'inversion-tools';
import { Service1, Service2 } from './services'; // class for example

export const Service1Token = Symbol.for('Service1');
export const Service2Token = Symbol.for('Service2');

Container.bind(Service1Token, Service1);
Container.bind(Service2Token, Service2);
```

> Notice: to implement dependency injection you must use the interfaces.

Then, you have to mark injectable classes with the @Injectable() decorator and mark the @Inject() destination constructors as follows:
```
//services.ts
import { Injectable } from 'inversion-tools';
import { Service1Token } from './main';

export interface IService2 {}

@Injectable()
export class Service1 {}

@Injectable()
export class Service2 {
	constructor(@Inject(Service1Token)) {}
}
```

After that, you can get an instance of the target class and use it as an IService2 contract: 

```
//main.ts
import { IService2 } from './services.ts'

...
const service2Instance = Container.resolve<IService2>(Service2Token);

```

You can also remove related token-class pairs:

```
//main.ts

...
Container.unbind(Service2Token);
```

This will remove bound pair as well as the existing instance.

##Specifying the scope of a class instance

You can specify in which scope an class instance will be used. There are two scopes: "singleton" and "common". This is specified at the token-class binding step:
```
//main.ts

...
Container.bind(token: Service1Token, classToInject: Service1, scope: 'common')
```

The default setting is "singleton". This means that the same class instance will be used for each entry. 
If "common" is specified, a new instance will be created for each entry.