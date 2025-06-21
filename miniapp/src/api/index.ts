import AuthAPI from "./auth";
import ChecksAPI from "./checks";
import JobsAPI from "./jobs";
import TasksAPI from "./tasks";

const baseUrl = "https://ecoapi.elasticspace.app/api";

export const api = {
  auth: AuthAPI(baseUrl),
  checks: ChecksAPI(baseUrl),
  jobs: JobsAPI(baseUrl),
  tasks: TasksAPI(baseUrl),
};