
const express = require('express');
const db = require('./db');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pic', express.static(path.join(__dirname, 'pic')));
app.use(cors());
app.use(express.json({ limit: '20mb' })); // or higher if needed
app.use(express.urlencoded({ limit: '20mb', extended: true }));


const picFolder = path.join(__dirname, 'public', 'pic');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, picFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save with original filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB

});



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
    
    io.emit('item-added');
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
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
  res.json({ success: true });
  }   catch (error) { 
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/orders', async (req, res) => {
  const { job_id, car_number, status} = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO orders(job_id, car_number,status)
      VALUES (?,?,?)`,
      [job_id, car_number, status]
    );
    res.status(201).json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: error.message });
  }
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/order-items', async (req, res) => {
  const { items } = req.body;
  try {
    const values = items.map(item => [item.order_id, item.item_id, item.quantity]);
    console.log(values);
    
    const [result] = await db.query(
      `INSERT INTO order_items(order_id, item_id, quantity)
      VALUES ?`,
      [values]
    );
    res.status(201).json({ success: true});
    
  } catch (error) {
    console.error('Error inserting order items:', error);
    res.status(500).json({ error: error.message });
  }
})
