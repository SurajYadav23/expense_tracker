import express from 'express';
import userRouter from "./routes/user.js";
import expenseRouter from "./routes/expense.js";
import Order from './models/Order.js';
import sequelize from './data/database.js';
import Expense from './models/Expense.js';
import resetpassword from './routes/resetpassword.js'
import User from './models/User.js';
import premiumFeatureRouter from './routes/premiumFeature.js'
import purchase from './routes/purchase.js'
import cors from 'cors';
import forgetpassword from './models/Forgotpassword.js';
import path from 'path';  // Move the import statement here
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/expense", expenseRouter);
app.use('/api/v1/premium', premiumFeatureRouter);
app.use('/api/v1/purchase', purchase);
app.use('/password', resetpassword);

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Nice working");
    console.log("good");
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasOne(forgetpassword);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Database sync error:', err);
    });

app.listen(port, () => {
    console.log(`server is running fine on ${port}`);
});
