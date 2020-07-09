# nestjs-config

## Description

### Convenient modular config for [`nest`](https://github.com/nestjs/nest) applications

1. Type casting (everything in `environment` is string) E.g. 'true' -> boolean ...
2. runtime validation
3. compatible with `typescript` you will have typed configs
4. modularity - you can define configs for every module in you project
5. get variables from environment variables by design
6. Convenient configs definition with [`class-transformer`](https://github.com/typestack/class-transformer)/[`class-validator`](https://github.com/typestack/class-validator)

## Installation

```bash
npm install --save @ukitgroup/nestjs-config
```

or

```bash
yarn add @ukitgroup/nestjs-config
```

## Short example

Override configuration for particular modules from environment

**.env**

```text
CAT__WEIGHT=5
```

**cat.config.ts**

```typescript
@Config('CAT')
export class CatConfig {
  @Env('WEIGHT')
  @Number()
  readonly weight: number;

  @Env('KNOW_PROGRAMMING')
  @Boolean()
  readonly knowsProgramming: boolean = true;
}
```

Get the cat config in a service

**cat.service.ts**

```typescript
@Injectable()
export class CatService {
  constructor(
    @Inject(CatConfig) private readonly config: CatConfig,
  ) {}

  meow(): string {
    // overridden from env
    // typeof this.config.weight === 'number'
    // this.config.weight === 5

    // default value
    // typeof this.config.knowsProgramming === 'boolean'
    // this.config.knowsProgramming === true
    return `meows..`;
  }
}
```

## Usage

**app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@ukitgroup/nestjs-config';
import { AppConfig } from './app.config';
import { CatModule } from './cat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      fromFile: '.env',
      configs: [AppConfig],
    }),
    CatModule,
  ],
})
export class AppModule {}
```

Create class that describes configuration for application

**app.config.ts**

```typescript
import { Config, Env } from '@ukitgroup/nestjs-config';
import { Integer } from '@ukitgroup/nestjs-config/types';

@Config('APP')
export class AppConfig {
  @Env('HTTP_PORT')
  @Integer()
  readonly httpPort: number = 3000;
}
```

Use AppConfig to configure application

**main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfig>(AppConfig);

  await app.listen(config.httpPort);
}
bootstrap();
```

Create class that describes configuration for particular module `CatsModule`

**cat.config.ts**

```typescript
import { Config, Env } from '@ukitgroup/nestjs-config';
import { Boolean, Number, String } from '@ukitgroup/nestjs-config/types';
import { Transform } from '@ukitgroup/nestjs-config/transformer';
import { IsDate, IsOptional } from '@ukitgroup/nestjs-config/validator';

@Config('CAT')
export class CatConfig {
  @Env('NAME')
  @String()
  readonly name: string;

  @Env('WEIGHT')
  @Number()
  readonly weight: number;

  @Env('KNOW_PROGRAMMING')
  @Boolean()
  readonly knowsProgramming: boolean = true;

  @Env('BIRTH_DATE')
  @Transform(value => new Date(value))
  @IsOptional()
  @IsDate()
  readonly birthDate: Date;
}
```

Inject `CatConfig` for `CatModule`

**cat.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@ukitgroup/nestjs-config';
import { CatConfig } from "./cat.config";
import { CatsService } from "./cats.service";

@Module({
  imports: [ConfigModule.forFeature([CatConfig])],
  providers: [CatsService],
})
export class CatModule {}
```

Get the cat config in a service

**cat.service.ts**

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { CatConfig } from './cat.config';

@Injectable()
export class CatService {
  constructor(
    @Inject(CatConfig) private readonly config: CatConfig,
  ) {}

  meow(): string {
    return `${this.config.name} meows..`;
  }
}
```

Override configuration for particular modules from environment

**.env**

```text
APP__HTTP_PORT=3000
CAT__NAME=vasya
CAT__WEIGHT=5
```

or on launch your application

```text
APP__HTTP_PORT=3000 CAT__NAME=vasya CAT__WEIGHT=5 node dist/main.js
```

Also you can see the example on github

## API

Define options for config in AppModule with:

```typescript
ConfigModule.forRoot(options: ConfigOptions)
```

```typescript
ConfigOptions: {
  fromFile?: string,
  configs?: ClassType[],
  imports?: NestModule[],
  providers: Provider[],
}
```

If you don't set `fromFile` option, `process.env` will be used.

In addition you can provide logger to the library to log validation errors via token `CONFIG_LOGGER`.

So as raw object via token `RAW_CONFIG`. You might need it in your tests:

```typescript
const moduleFixture: TestingModule = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(RAW_CONFIG)
  .useValue({
    APP__HTTP_PORT: '3000',
    CAT__WEIGHT: '5',
  })
  .compile();
```

Define configs in any module with:

```typescript
ConfigModule.forFeature(configs: ClassType[])
```

### Decorators

| Decorator                           | Description                                                                   |
|-------------------------------------|-------------------------------------------------------------------------------|
| **Common config decorators**        |                                                                               |
| `@Config(name: string)`             | Add prefix to env variables                                                   |
| `@Env(name: string)`                | Extract env with `name` to this varaible                                      |
|                                     |                                                                               |
| **Type decorators**                 | Import from `@ukitgroup/nestjs-config/types`                                  |
| `@String()`                         | String variable (`@IsString`)                                                 |
| `@Number()`                         | Number variable (`parseFloat` + `@IsNumber`                                   |
| `@Integer()`                        | Integer variable (`parseInt` + `@IsInteger`                                   |
| `@Boolean()`                        | Boolean variable ('true','false' + @IsBool`)                                  |
| `@Transform(transformFn: Function)` | Custom transformation. Import from `@ukitgroup/nestjs-config/transformer`     |
|                                     |                                                                               |
| **Validation decorators**           | The same as [`class-validator`](https://github.com/typestack/class-validator). Import from `@ukitgroup/nestjs-config/validator`. |

## Transformation

You can either use our built-in types like Integer, Boolean, etc..  
Or transform value with your own rule with Transform:

```text
CAT__YOUR_TYPE_VARIABLE=...
```

```typescript
@Config('CAT')
class CatConfig {
  @Env('YOUR_TYPE_VARIABLE')
  @Transform(fn) // where fn is your transformation function
  myVariable: MyType;
}
```

We use our own version of [class-transformer](https://github.com/typestack/class-transformer): [@ukitgroup/class-transformer](https://github.com/ukitgroup/class-transformer)

## Validation

```text
CAT__WEIGHT=not_a_number
```

```typescript
@Config('CAT')
class CatConfig {
  @Env('WEIGHT')
  @Number()
  weight: number;
}
```

Library will throw an error on launch application: `Cat.weight received 'not_a_number' errors: {"IsNumber": "Should be number"}`

## Requirements

1. @nestjs/common ^7.2.0
2. @nestjs/core ^7.2.0

## License

@ukitgroup/nestjs-config is [MIT licensed](LICENSE).
