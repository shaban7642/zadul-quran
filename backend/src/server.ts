import './environment';
import App from './app';
import { AuthRoute, SettingsRoute, UserRoute } from './routes';
import DepartmentRoute from './routes/department.route';

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new DepartmentRoute(),
  new SettingsRoute(),
]);

app.listen();
