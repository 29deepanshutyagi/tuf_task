import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME 
});

// Get all flashcards
app.get('/flashcards', (req: Request, res: Response) => {
    db.query('SELECT * FROM flashcards', (err: mysql.QueryError | null, result: any) => {
        if (err) throw err;
        res.send(result);
    });
});

// Add a new flashcard
app.post('/flashcards', (req: Request, res: Response) => {
    const { question, answer } = req.body;
    db.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer], (err: mysql.QueryError | null, result: any) => {
        if (err) throw err;
        res.send(result);
    });
});

// Update a flashcard
app.put('/flashcards/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.query('UPDATE flashcards SET question = ?, answer = ? WHERE id = ?', [question, answer, id], (err: mysql.QueryError | null, result: any) => {
        if (err) throw err;
        res.send(result);
    });
});

// Delete a flashcard
app.delete('/flashcards/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.query('DELETE FROM flashcards WHERE id = ?', [id], (err: mysql.QueryError | null, result: any) => {
        if (err) throw err;
        res.send(result);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
