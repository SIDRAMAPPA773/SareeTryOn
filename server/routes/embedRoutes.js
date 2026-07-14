const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Model3D = require('../models/Model3D');
const { downloadModel } = require('../controllers/jewelryController');

// @route   GET /api/models/:model_id/download
// @desc    Download GLB file directly (public access for viewer)
router.get('/api/models/:model_id/download', downloadModel);

// @route   GET /embed/:unique_code/meta
// @desc    Get model metadata for embed code
router.get('/embed/:unique_code/meta', async (req, res, next) => {
  try {
    const model = await Model3D.findOne({ embed_code: req.params.unique_code.toUpperCase(), status: 'active' });
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    const feUrl = process.env.PIXRITY_FRONTEND_URL || 'http://localhost:5173'; // Vite default port is 5173
    const baseUrl = process.env.PIXRITY_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const absoluteGlbUrl = model.glb_url.startsWith('http') ? model.glb_url : `${baseUrl}${model.glb_url}`;

    res.status(200).json({
      unique_code: model.embed_code,
      model_id: model._id,
      name: model.name,
      model_url: absoluteGlbUrl,
      thumbnail_url: model.thumbnail_url.startsWith('http') ? model.thumbnail_url : `${baseUrl}${model.thumbnail_url}`,
      embed_url: `${feUrl}/embed/${model.embed_code}`,
      created_at: model.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /embed/:unique_code/view
// @desc    Track view analytics (simple no-content response)
router.get('/embed/:unique_code/view', async (req, res, next) => {
  // Return 204 No Content as passive view logger
  res.status(204).end();
});

// @route   GET /embed/:unique_code/model.glb
// @desc    Proxy to serve the GLB file directly with CORS headers
router.get('/embed/:unique_code/model.glb', async (req, res, next) => {
  try {
    const model = await Model3D.findOne({ embed_code: req.params.unique_code.toUpperCase(), status: 'active' });
    if (!model) {
      return res.status(404).json({ success: false, message: 'Model not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    if (!model.storage_path || !fs.existsSync(model.storage_path)) {
      return res.status(404).json({ success: false, message: 'Model file not found' });
    }

    res.sendFile(model.storage_path);
  } catch (error) {
    next(error);
  }
});

// @route   GET /embed.js
// @desc    Serve the embedding script
router.get('/embed.js', (req, res) => {
  const fe = process.env.PIXRITY_FRONTEND_URL || 'http://localhost:5173';
  const be = process.env.PIXRITY_BASE_URL || `${req.protocol}://${req.get('host')}`;
  
  const js = `/**
 * Pixrity Embed v2.0  |  pixrity.com
 * Usage:
 *   <script src="${be}/embed.js"></script>
 *   <div data-pixrity="PIX-XXXXXXXX"
 *        data-width="100%"
 *        data-height="500px"
 *        data-theme="light"
 *        data-autorotate="true"></div>
 */
(function(){
  'use strict';
  var FE='${fe}';
  function boot(){
    document.querySelectorAll('[data-pixrity]').forEach(function(el){
      var code=el.getAttribute('data-pixrity'); if(!code)return;
      var w=el.getAttribute('data-width')||'100%';
      var h=el.getAttribute('data-height')||'500px';
      var theme=el.getAttribute('data-theme')||'light';
      var rotate=el.getAttribute('data-autorotate')!=='false';
      var ar=el.getAttribute('data-ar')==='true';
      var q=new URLSearchParams({theme:theme,autorotate:rotate?'1':'0',ar:ar?'1':'0'});
      var f=document.createElement('iframe');
      f.src=FE+'/embed/'+encodeURIComponent(code)+'?'+q;
      f.width=w; f.height=h;
      f.style.cssText='border:none;display:block;';
      f.allow='xr-spatial-tracking;fullscreen';
      f.allowFullscreen=true;
      f.title='Pixrity 3D - '+code;
      el.replaceWith(f);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Content-Type', 'application/javascript');
  res.send(js);
});

module.exports = router;
