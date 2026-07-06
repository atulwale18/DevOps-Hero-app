export const linuxMissions = [
  {
    id: 'linux-1',
    title: 'Create directories',
    description: 'Create a new directory named "project". Use the mkdir command.',
    expectedCommand: /^mkdir project$/,
    rewardXP: 15,
    hint: 'Use mkdir followed by the directory name.'
  },
  {
    id: 'linux-2',
    title: 'Manage files',
    description: 'Create an empty file named "config.txt". Use the touch command.',
    expectedCommand: /^touch config\.txt$/,
    rewardXP: 15,
    hint: 'Use touch followed by the file name.'
  },
  {
    id: 'linux-3',
    title: 'Change permissions',
    description: 'Give execute permission to "script.sh" for the user. Use chmod.',
    expectedCommand: /^chmod u\+x script\.sh$|^chmod 744 script\.sh$/,
    rewardXP: 20,
    hint: 'Use chmod u+x filename'
  },
  {
    id: 'linux-4',
    title: 'Archive logs',
    description: 'Create a backup of the logs folder. Use tar -czvf backup.tar logs/',
    expectedCommand: /^tar -czvf backup\.tar logs\/?$/,
    rewardXP: 20,
    hint: 'Use tar with -czvf flags.'
  },
  {
    id: 'linux-5',
    title: 'Find files',
    description: 'Find all files ending with ".log" in the current directory.',
    expectedCommand: /^find \. -name ("|')?\*\.log("|')?$/,
    rewardXP: 15,
    hint: 'Use find . -name "*.log"'
  },
  {
    id: 'linux-6',
    title: 'Monitor processes',
    description: 'View running processes using the standard interactive monitor command.',
    expectedCommand: /^top$/,
    rewardXP: 15,
    rewardBadge: 'Linux Explorer',
    hint: 'Just type top'
  }
];
