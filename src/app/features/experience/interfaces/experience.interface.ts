export interface ISystem {
  name: string;
  description: string;
}

export interface IExperience {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  clients?: string;
  systems?: ISystem[];
  company_logo: string;
  technologies_used: string[];
}
