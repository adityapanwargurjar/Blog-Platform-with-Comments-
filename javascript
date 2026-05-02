const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/blogDB');

// Blog Schema (Post + Comments)
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    comments: [{ text: String, date: { type: Date, default: Date.now } }]
});

const Post = mongoose.model('Post', postSchema);

// --- API Routes ---

// 1. Get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// 2. Create a new post
app.post('/posts', async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json(newPost);
});

// 3. Add a comment to a post
app.post('/posts/:id/comment', async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.comments.push({ text: req.body.text });
    await post.save();
    res.json(post);
});

// 4. Delete a post
app.delete('/posts/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
});

app.listen(5000, () => console.log("Blog Server running on port 5000"));
