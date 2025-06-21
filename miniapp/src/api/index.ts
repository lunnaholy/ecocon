import AuthAPI from "./auth";
import ChecksAPI from "./checks";
import JobsAPI from "./jobs";
import TasksAPI from "./tasks";

const baseUrl = "https://99d3-185-139-138-106.ngrok-free.app/api";

export const api = {
  auth: AuthAPI(baseUrl),
  checks: ChecksAPI(baseUrl),
  jobs: JobsAPI(baseUrl),
  tasks: TasksAPI(baseUrl),
};