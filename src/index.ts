import app from './app';
import { getPort } from './config';

const port =  getPort()

app.listen(port, (): void => {
  console.log('Server is up on port ' + port);
});
