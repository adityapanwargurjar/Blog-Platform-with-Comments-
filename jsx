import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch all posts
  const fetchPosts = () => {
    axios.get('http://localhost:5000/posts').then(res => setPosts(res.data));
  };

  useEffect(() => { fetchPosts(); }, []);

  // Create Post
  const handlePostSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/posts', { title, content, author: 'User' })
      .then(() => {
        setTitle(''); setContent(''); fetchPosts();
      });
  };

  // Add Comment
  const addComment = (id, text) => {
    if(!text) return;
    axios.post(`http://localhost:5000/posts/${id}/comment`, { text })
      .then(() => fetchPosts());
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#3b82f6' }}>Thiranex Blog Platform</h1>

      {/* Create Post Form */}
      <form onSubmit={handlePostSubmit} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Create a New Post</h3>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '97%', marginBottom: '10px', padding: '8px' }} required />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} style={{ width: '97%', height: '100px', padding: '8px' }} required />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Publish Post</button>
      </form>

      {/* Blog Feed */}
      <div>
        {posts.map(post => (
          <div key={post._id} style={{ borderBottom: '2px solid #eee', marginBottom: '20px', paddingBottom: '20px' }}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            
            <div style={{ marginLeft: '20px', background: '#f9f9f9', padding: '10px' }}>
              <h4>Comments:</h4>
              {post.comments.map((c, index) => <p key={index} style={{ fontSize: '0.9em' }}>• {c.text}</p>)}
              <input 
                placeholder="Write a comment..." 
                onKeyDown={(e) => { if(e.key === 'Enter') { addComment(post._id, e.target.value); e.target.value = ''; } }}
                style={{ padding: '5px', width: '80%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
