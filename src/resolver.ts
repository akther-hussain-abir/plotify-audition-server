import { Resolver, Arg, Query, Mutation } from "type-graphql";
import { Phase, Task, TaskInput } from "./entities";

const store: Phase[] = [
  {
    id: 1,
    name: "Phase 1",
    completed: false,
    tasks: [
      {
        id: 1,
        name: "Task 1 Phase 1",
        completed: false
      }
    ]
  }
]; // In-memory store

@Resolver()
export class PhaseResolver {

  /**
   * Get all phases.
   *
   * @returns {Phase[]} - The array of all phases with its associated tasks.
   */
  @Query(() => [Phase])
  phases(): Phase[] {
    return store;
  }

  /**
   * Create a new task.
   *
   * @param {TaskInput} taskInput - The input data for creating a task.
   * @returns {Phase} - The updated phase containing the new task.
   * @throws {Error} - If the phase is not found.
   */
  @Mutation(() => Phase)
  createTask(@Arg("task") taskInput: TaskInput): Phase {
    const { name, phaseId } = taskInput;
    const phase = store.find((p) => p.id === phaseId);

    if (!phase) {
      throw new Error("Phase not found");
    }

    const task: Task = {
      id: phase.tasks.length + 1,
      name: name || "",
      completed: false,
    };

    phase.tasks.push(task);
    return phase;
  }

  /**
   * Mark a task as completed.
   *
   * @param {number} taskId - The ID of the task to complete.
   * @returns {Phase} - The updated phase containing the completed task.
   * @throws {Error} - If the task is not found.
   */
  @Mutation(() => Phase)
  completeTask(@Arg("taskId") taskId: number): Phase {
    let targetPhase: Phase | undefined;
    let targetTask: Task | undefined;

    for (const phase of store) {
      const task = phase.tasks.find((t: any) => t.id === taskId);

      if (task) {
        targetPhase = phase;
        targetTask = task;
        break;
      }
    }

    if (!targetPhase || !targetTask) {
      throw new Error("Task not found");
    }

    const previousPhaseTasks = targetPhase.tasks.filter(
      (t: any) => t.id !== taskId && !t.completed
    );

    if (previousPhaseTasks.length > 0) {
      throw new Error(
        "Cannot complete task before completing previous phase tasks"
      );
    }

    targetTask.completed = true;

    const allPhaseTasksCompleted = targetPhase.tasks.every(
      (t: any) => t.completed
    );
    if (allPhaseTasksCompleted) {
      targetPhase.completed = true;
      const targetPhaseId = targetPhase.id;

      if (!targetPhaseId) {
        throw new Error("Invalid target phase id");
      }

      const nextPhase = store.find((p) => p.id === targetPhaseId + 1);
      if (nextPhase) {
        nextPhase.completed = false;
      }
    }

    return targetPhase;
  }

  /**
   * Reopen a previously completed task.
   *
   * @param {number} taskId - The ID of the task to reopen.
   * @returns {Phase} - The updated phase containing the reopened task.
   * @throws {Error} - If the task is not found.
   */
  @Mutation(() => Phase)
  reopenTask(@Arg("taskId") taskId: number): Phase {
    let targetPhase: Phase | undefined;
    let targetTask: Task | undefined;

    for (const phase of store) {
      const task = phase.tasks.find((t) => t.id === taskId);

      if (task) {
        targetPhase = phase;
        targetTask = task;
        break;
      }
    }

    if (!targetPhase || !targetTask) {
      throw new Error("Task not found");
    }

    targetTask.completed = false;

    return targetPhase;
  }
}
