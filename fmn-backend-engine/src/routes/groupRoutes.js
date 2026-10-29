const express = require('express');
const router = express.Router();

// Mock Data for Facebook Group Feed
const groupPosts = [
  {
    id: 'post_1',
    author: 'Sarah Jenkins',
    avatar: '/images/avatars/sarah.jpg',
    timestamp: '2 hours ago',
    content: 'Welcome everyone to our family archive network! Share your recent photos and event updates here.',
    mediaUrl: '/images/posts/reunion.jpg',
    likes: 12,
    comments: [
      { author: 'Uncle Mark', text: 'Great initiative! Looking forward to seeing all the old photos.' }
    ]
  }
];

// GET: Render Facebook Group Feed
router.get('/family-feed', (req, res) => {
  res.render('group-feed', {
    groupName: 'Jenkins Family Network',
    memberCount: 24,
    posts: groupPosts
  });
});

// POST: Create New Feed Post
router.post('/posts', (req, res) => {
  const { content, mediaUrl } = req.body;
  const newPost = {
    id: `post_${Date.now()}`,
    author: 'You',
    avatar: '/images/avatars/default.jpg',
    timestamp: 'Just now',
    content,
    mediaUrl: mediaUrl || null,
    likes: 0,
    comments: []
  };
  groupPosts.unshift(newPost);
  res.redirect('/groups/family-feed');
});

module.exports = router;
