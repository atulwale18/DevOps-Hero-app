import { Question } from '../store/useGameStore';

export const devopsQuestions: Question[] = [
  // Docker
  {
    id: 'docker-1',
    category: 'Docker',
    question: 'Which command builds a Docker image from a Dockerfile?',
    options: ['docker run', 'docker build', 'docker logs', 'docker start'],
    correctAnswer: 1 // index of 'docker build'
  },
  {
    id: 'docker-2',
    category: 'Docker',
    question: 'What is the default port for a Docker Registry?',
    options: ['5000', '8080', '2375', '443'],
    correctAnswer: 0
  },
  // Kubernetes
  {
    id: 'k8s-1',
    category: 'Kubernetes',
    question: 'Which command lists pods in the current namespace?',
    options: ['kubectl get pods', 'kubectl list pods', 'docker ps', 'kubectl show pods'],
    correctAnswer: 0
  },
  {
    id: 'k8s-2',
    category: 'Kubernetes',
    question: 'What is the smallest deployable unit in Kubernetes?',
    options: ['Container', 'Node', 'Pod', 'Cluster'],
    correctAnswer: 2
  },
  // AWS
  {
    id: 'aws-1',
    category: 'AWS',
    question: 'Which service provides highly scalable object storage?',
    options: ['EC2', 'RDS', 'S3', 'EBS'],
    correctAnswer: 2
  },
  {
    id: 'aws-2',
    category: 'AWS',
    question: 'What does IAM stand for in AWS?',
    options: ['Internet Access Management', 'Identity and Access Management', 'Instance Allocation Method', 'Internal API Manager'],
    correctAnswer: 1
  },
  // Linux
  {
    id: 'linux-1',
    category: 'Linux',
    question: 'Which command is used to change file permissions?',
    options: ['chown', 'chmod', 'chgrp', 'passwd'],
    correctAnswer: 1
  },
  {
    id: 'linux-2',
    category: 'Linux',
    question: 'How do you view running processes interactively?',
    options: ['ps', 'grep', 'top', 'ls'],
    correctAnswer: 2
  }
];

export const getRandomQuestion = (): Question => {
  const index = Math.floor(Math.random() * devopsQuestions.length);
  return devopsQuestions[index];
};
