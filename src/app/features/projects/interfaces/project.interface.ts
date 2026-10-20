export interface IProject {
  title: string;
  description: string;
  /** Captura en modo claro. */
  image?: string;
  /** Captura en modo oscuro; se usa cuando el portafolio está en oscuro. */
  imageDark?: string;
  tech: string[];
  codeLink: string;
  demoLink: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured?: boolean;
}