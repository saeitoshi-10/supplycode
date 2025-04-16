export type Issue = {
    id: string;
    title: string;
    deadline: string;
    labels?: string[];
    attachments?: number;
  };
  
  export type Project = {
    id: string;
    name: string;
    organization: string;
    creator: string;
    contributors: string[];
    issues: Issue[];
  };
  
  export type ProjectsResponse = {
    asCreator: Project[];
    asContributor: Project[];
  };
  