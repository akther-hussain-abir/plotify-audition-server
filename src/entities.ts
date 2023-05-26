import { ObjectType, Field, Int, InputType } from 'type-graphql';

@ObjectType()
export class Phase {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [Task])
  tasks!: Task[];

  @Field()
  completed: boolean = false; // Assign a default value
}

@ObjectType()
export class Task {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  completed: boolean = false; // Assign a default value
}

@InputType()
export class TaskInput {
  @Field()
  name!: string;

  @Field()
  phaseId!: number;
}
