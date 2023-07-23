import './environment';
import App from './app';
import { AuthRoute, UserRoute } from './routes';

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
