export interface IProject {
  title: string;
  description: string;
  image?: string;
  tech: string[];
  codeLink: string;
  demoLink: string;
  status: 'completed' | 'in-progress' | 'planned';
}