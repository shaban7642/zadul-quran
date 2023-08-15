import './environment';
import App from './app';
import { AuthRoute, DocumentsRoute, SettingsRoute, UserRoute } from './routes';
import DepartmentRoute from './routes/department.route';
import SessionRoute from './routes/sessions.route';
import ReportRoute from './routes/reports.route';

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new DepartmentRoute(),
  new SettingsRoute(),
  new DocumentsRoute(),
  new SessionRoute(),
  new ReportRoute(),
]);

app.listen();
