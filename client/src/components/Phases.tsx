import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import './Phases.css';
import ErrorComponent from './ErrorComponent';

const GET_ALL_PHASES = gql`
  query GetAllPhases {
    phases {
      id
      name
      completed
      tasks {
        id
        name
        completed
      }
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($taskId: ID!, $completed: Boolean!) {
    updateTask(id: $taskId, completed: $completed) {
      id
      name
      completed
    }
  }
`;

const REOPEN_TASK = gql`
  mutation ReopenTask($taskId: ID!) {
    reopenTask(id: $taskId) {
      id
      name
      completed
    }
  }
`;

const PhasesPage: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_PHASES);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [reopenTask] = useMutation(REOPEN_TASK);

  const handleUpdateTask = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        await updateTask({ variables: { taskId, completed } });
      } else {
        await reopenTask({ variables: { taskId } });
      }
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <ErrorComponent details={error}></ErrorComponent>;
  }

  return (
    <div className="phases-container">
      <h1>My Startup Progress</h1>
      {data.phases.map((phase: any) => (
        <div className="phase" key={phase.id}>
          <h2 className="phase-name">{phase.name}</h2>
          <ul className="tasks-list">
            {phase.tasks.map((task: any) => (
              <li className="task-item" key={task.id}>
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleUpdateTask(task.id, !task.completed)}
                />
                <p className="task-name">{task.name}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PhasesPage;
