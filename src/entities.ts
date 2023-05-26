import { ObjectType, Field, Int, InputType } from 'type-graphql';

/**
 * Represents a Phase.
 * @typedef {Object} Phase
 * @property {string} id - The unique identifier of the phase.
 * @property {string} name - The name of the phase.
 * @property {boolean} completed - The completion status of the phase.
 * @property {Task[]} tasks - The array of tasks belonging to the phase.
 */
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

/**
 * Represents a Task.
 * @typedef {Object} Task
 * @property {string} id - The unique identifier of the task.
 * @property {string} name - The name of the task.
 * @property {boolean} completed - The completion status of the task.
 */
@ObjectType()
export class Task {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  completed: boolean = false; // Assign a default value
}

/**
 * Represents the input for a Task.
 * @typedef {Object} TaskInput
 * @property {string} name - The name of the task.
 * @property {string} phaseId - The ID of the phase that the task belongs to.
 */
@InputType()
export class TaskInput {
  @Field()
  name!: string;

  @Field()
  phaseId!: number;
}
