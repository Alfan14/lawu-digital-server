import express from 'express';
import pool from '../db/index.mjs';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config(); 

router.post('/get', async (req, res) => {
  pool.query('SELECT * FROM news_post ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

router.get('/get/:id', async (req, res) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM news_post WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

router.post('/post', async (req, res) => {
    try {
        const {
            title, slug, excerpt, content, cover_image,
            author_name, author_image, category, published_at, tags
        } = req.body;

        const tagArray = tags?.split(',').map(t => t.trim());

        await pool.query(
            `INSERT INTO news_post
            (title, slug, excerpt, content, cover_image, author_name, author_image, category, published_at, tags, is_published)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)`,
            [title, slug, excerpt, content, cover_image, author_name, author_image, category, published_at, tagArray]
        );

        res.send(`<h2>Berita berhasil ditambahkan!</h2><a href="/admin.html">Kembali</a>`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menambahkan berita");
    }
});

router.patch('/patch', async (req, res) => {
    const id = parseInt(request.params.id);
    const { title, slug, excerpt, content, author_name, author_image, category, cover_image, published_at, tags, is_published } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

     if (title) {
      fields.push(`title = $${valueIndex++}`);
      values.push(title);
    }
    if (slug) {
      fields.push(`slug = $${valueIndex++}`);
      values.push(slug);
    }
    if (excerpt) {
      fields.push(`excerpt = $${valueIndex++}`);
      values.push(excerpt);
    }
    if (content) {
      fields.push(`content = $${valueIndex++}`);
      values.push( content);
    }
    if (author_name) {
      fields.push(`author_name = $${valueIndex++}`);
      values.push(author_name);
    }
    if (author_image) {
      fields.push(`author_image = $${valueIndex++}`);
      values.push(author_image);
    }
    if (category) {
      fields.push(`category = $${valueIndex++}`);
      values.push(category);
    }
    if (cover_image) {
      fields.push(`cover_image = $${valueIndex++}`);
      values.push(cover_image);
    }
    if (status) {
      fields.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    if (published_at) {
      fields.push(`published_at = $${valueIndex++}`);
      values.push(published_at);
    }
    if (tags) {
      fields.push(`tags = $${valueIndex++}`);
      values.push( tags);
    }
    if (is_published) {
      fields.push(`is_published = $${valueIndex++}`);
      values.push(is_published);
    }
  
    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE news_post SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`NEWS with ID: ${id} patched.`);
    });
  });

router.delete('/delete', async (req, res) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM news_post WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
});

export default router;
