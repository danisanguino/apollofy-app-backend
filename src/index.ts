import app from './server';
import config from '../src/config/config';

const PORT = config.app.PORT;

app.listen(PORT, () => {
  console.log(`Server is on FIRE🔥 on port ${PORT}
Database is connected to ${config.db.URI}`);
});
