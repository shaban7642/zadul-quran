import './environment';
import App from './app';
import { AuthRoute, DocumentsRoute, SettingsRoute, UserRoute } from './routes';
import DepartmentRoute from './routes/department.route';

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new DepartmentRoute(),
  new SettingsRoute(),
  new DocumentsRoute(),
]);

app.listen();
