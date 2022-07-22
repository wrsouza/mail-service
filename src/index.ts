import express, { json } from 'express'
import cors from 'cors';
import routes from './routes'

const PORT = process.env.PORT || 3333;
const server = express();
server.use(json());
server.use(cors())
server.use(routes);

server.listen(PORT, () => console.log(`Server Mail is running http://localhost:${PORT}`))