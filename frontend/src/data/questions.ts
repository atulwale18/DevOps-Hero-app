import type { Question } from '../store/useGameStore';

export const devopsQuestions: Question[] = [
  // Docker
  { id: 'docker-1', category: 'Docker', question: 'Which command builds a Docker image from a Dockerfile?', options: ['docker run', 'docker build', 'docker logs', 'docker start'], correctAnswer: 1 },
  { id: 'docker-2', category: 'Docker', question: 'What is the default port for a Docker Registry?', options: ['5000', '8080', '2375', '443'], correctAnswer: 0 },
  { id: 'docker-3', category: 'Docker', question: 'How do you map port 80 in a container to 8080 on the host?', options: ['-p 80:8080', '-p 8080:80', '-port 80-8080', '--expose 8080'], correctAnswer: 1 },
  { id: 'docker-4', category: 'Docker', question: 'Which command removes all stopped containers?', options: ['docker rm $(docker ps -a -q)', 'docker container prune', 'docker system rm', 'docker clean all'], correctAnswer: 1 },
  
  // Kubernetes
  { id: 'k8s-1', category: 'Kubernetes', question: 'Which command lists pods in the current namespace?', options: ['kubectl get pods', 'kubectl list pods', 'docker ps', 'kubectl show pods'], correctAnswer: 0 },
  { id: 'k8s-2', category: 'Kubernetes', question: 'What is the smallest deployable unit in Kubernetes?', options: ['Container', 'Node', 'Pod', 'Cluster'], correctAnswer: 2 },
  { id: 'k8s-3', category: 'Kubernetes', question: 'What component runs on every node and communicates with the master?', options: ['kube-proxy', 'etcd', 'kubelet', 'kube-apiserver'], correctAnswer: 2 },
  { id: 'k8s-4', category: 'Kubernetes', question: 'Which service type exposes a service on a static port on each Node?', options: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'], correctAnswer: 1 },
  
  // AWS
  { id: 'aws-1', category: 'AWS', question: 'Which service provides highly scalable object storage?', options: ['EC2', 'RDS', 'S3', 'EBS'], correctAnswer: 2 },
  { id: 'aws-2', category: 'AWS', question: 'What does IAM stand for in AWS?', options: ['Internet Access Management', 'Identity and Access Management', 'Instance Allocation Method', 'Internal API Manager'], correctAnswer: 1 },
  { id: 'aws-3', category: 'AWS', question: 'Which service is used for serverless computing?', options: ['AWS Lambda', 'Amazon EC2', 'AWS Beanstalk', 'Amazon ECS'], correctAnswer: 0 },
  { id: 'aws-4', category: 'AWS', question: 'What is the fully managed NoSQL database service in AWS?', options: ['Amazon RDS', 'Amazon Aurora', 'Amazon DynamoDB', 'Amazon Redshift'], correctAnswer: 2 },
  
  // Linux
  { id: 'linux-1', category: 'Linux', question: 'Which command is used to change file permissions?', options: ['chown', 'chmod', 'chgrp', 'passwd'], correctAnswer: 1 },
  { id: 'linux-2', category: 'Linux', question: 'How do you view running processes interactively?', options: ['ps', 'grep', 'top', 'ls'], correctAnswer: 2 },
  { id: 'linux-3', category: 'Linux', question: 'Which directory contains configuration files in Linux?', options: ['/bin', '/home', '/etc', '/var'], correctAnswer: 2 },
  { id: 'linux-4', category: 'Linux', question: 'What command searches for a specific string in a file?', options: ['find', 'sed', 'awk', 'grep'], correctAnswer: 3 },
  
  // CI/CD
  { id: 'cicd-1', category: 'CI/CD', question: 'What does CI stand for?', options: ['Continuous Integration', 'Code Integration', 'Continuous Infrastructure', 'Cloud Implementation'], correctAnswer: 0 },
  { id: 'cicd-2', category: 'CI/CD', question: 'Which tool is NOT typically used for CI/CD pipelines?', options: ['Jenkins', 'GitLab CI', 'Photoshop', 'GitHub Actions'], correctAnswer: 2 },
  { id: 'cicd-3', category: 'CI/CD', question: 'What is the purpose of an artifact repository?', options: ['Storing source code', 'Storing compiled binaries and packages', 'Storing passwords', 'Running unit tests'], correctAnswer: 1 }
];

export const getRandomQuestion = (askedIds: string[] = []): Question => {
  const available = devopsQuestions.filter(q => !askedIds.includes(q.id));
  
  if (available.length === 0) {
    // If all questions have been asked, pick any random one to prevent crash
    return devopsQuestions[Math.floor(Math.random() * devopsQuestions.length)];
  }
  
  const index = Math.floor(Math.random() * available.length);
  return available[index];
};
