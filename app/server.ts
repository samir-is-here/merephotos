import app from "./image-server";
import * as cors from 'cors';

const PORT: number = +process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})