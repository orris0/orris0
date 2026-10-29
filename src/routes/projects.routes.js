const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * GET /api/projects/list
 * Returns metadata listing for decoupled book exercise templates
 */
router.get('/list', (req, res) => {
  res.json({
    status: 'success',
    book: 'CSS Secrets & jQuery: Novice to Ninja',
    author: 'Adrian West Projects Portfolio',
    collection: [
      {
        id: 'proj_01',
        name: 'Project 1 Template',
        path: '/adrian-west-projects/project1-template/index.html',
        description: 'Layout rules and background structure implementations.'
      },
      {
        id: 'proj_02',
        name: 'Project 2 Template',
        path: '/adrian-west-projects/project2-template/index.html',
        description: 'Advanced custom UI components and web layout secrets.'
      }
    ]
  });
});

module.exports = router;
