
const express = require('express');
const db = require('./db');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());


app.get('/items', async (req, res) => {
  try {
    const [result] = await db.execute('SELECT * FROM items');
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      // env: {
      //   host:  '127.0.0.1',
      //   user:  'root',
      //   database:  'small material',
      // }
    });
  }
});
app.post('/items', async (req, res) => {
  
  const {name, img, cate_id ,size} = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO items(name, img, cate_id ,size)
      VALUES (?,?,?,?)`,
      [name, img, cate_id ,size]
    );
    
    console.log('POST /items body:', req.body);
    res.status(201).json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/categorys', async (req, res) => {
    console.log('GET /categorys called');
    try {
      const [result] = await db.execute('SELECT * FROM categorys');
      console.log('DB result:', result);
      res.json(result);
    } catch (error) {
      console.error('Error in /categorys:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
      });
    }
});
app.get('/category:id', async (req, res) => {
  try {
    
    const id = parseInt(req.params.id);
    
    
    const [result] = await db.execute('SELECT * FROM categorys WHERE id = ? ', [id]);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      // env: {
        //   host:  '127.0.0.1',
        //   user:  'root',
        //   database:  'small material',
        // }
      });
    }
  });

app.post('/ropes', async (req, res) => {
  
  const {hoist_rope, governer_rope, whisper_flex ,travel_cable, travel_multi, hoistway , job_id, car} = req.body;
  
  
  try {
    const [result] = await db.execute(
      `INSERT INTO ropes(hoist_rope, governer_rope, whisper_flex ,travel_cable, travel_multi, hoistway , job_id, car)
      VALUES (?,?,?,?,?,?,?,?)`,
      [hoist_rope, governer_rope, whisper_flex ,travel_cable, travel_multi, hoistway , job_id, car]
    );
    
    console.log('POST /ropes body:', req.body);
    res.status(201).json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error('Error inserting measurments:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/jobs', async (req, res) => {
  try {
    const [result] = await db.execute('SELECT * FROM jobs');
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
    });
  }
});


  

const PORT = 3020;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})