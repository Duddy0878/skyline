
const express = require('express');
const db = require('./db');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.use(express.json({ limit: '20mb' })); // or higher if needed
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const picFolder = path.join(__dirname, 'public', 'pic');
const upload = multer({
  dest: picFolder,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

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

app.get('/items:id', async (req, res) => {
  try {
    
    const id = parseInt(req.params.id);
    
    
    const [result] = await db.execute('SELECT * FROM items WHERE id = ? ', [id]);
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
app.patch('/items:id', async (req, res) => {
  try {
    
    const id = parseInt(req.params.id);
    const { name, img, cate_id ,size} = req.body;

    
      const updates = []
      const values = []

      if (name !== undefined) {
        updates.push('name = ?')
        values.push(name)
      }
      if (img !== undefined) {
        updates.push('img = ?')
        values.push(img)
      }
      if (cate_id !== undefined) {
        updates.push('cate_id = ?')
        values.push(cate_id)
      }
      if (size !== undefined) {
        updates.push('size = ?')
        values.push(size)
      }

      if (updates.length > 0) {
        const sql = `UPDATE items SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);
        await db.execute(sql, values);
      }

      res.json({ success: true });
    } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      });
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

app.get('/list-pic', (req, res) => {
  fs.readdir(picFolder, (err, files) => {
    if (err) return res.status(500).json([]);
    res.json(files);
  });
});

app.post('/upload-pic', upload.single('image'), (req, res) => {
  res.json({ success: true });
});




  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
