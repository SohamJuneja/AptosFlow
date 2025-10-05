const express = require('express');
const path = require('path');
const app = express();
const PORT = 9090;

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-dashboard.html'));
});

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║        🎬 AptosFlow Demo Dashboard Server 🎬         ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

🌐 Dashboard available at:
   
   👉 http://localhost:${PORT}
   
📊 Open this URL in your browser to see the live demo!

✨ Features:
   • Beautiful animated UI
   • Live execution simulation
   • Real-time statistics
   • Workflow visualization

Press Ctrl+C to stop the server
`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.log(`\n💡 Solutions:`);
    console.log(`   1. Stop other processes using port ${PORT}`);
    console.log(`   2. Or change PORT in demo-server.js to another number`);
    process.exit(1);
  } else {
    console.error(`\n❌ Server error:`, err);
    process.exit(1);
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

// Prevent process from exiting
setInterval(() => {}, 1000);
