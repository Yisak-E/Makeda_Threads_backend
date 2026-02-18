#!/bin/bash
# Start MongoDB on WSL

echo "🚀 Starting MongoDB..."

# Create data directory if it doesn't exist
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

# Start MongoDB
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongodb.log

echo ""
echo "✅ MongoDB started!"
echo ""
echo "Connection string: mongodb://localhost:27017/makeda-threads"
echo ""
echo "To check status:"
echo "  ps aux | grep mongod"
echo ""
echo "To stop MongoDB:"
echo "  sudo pkill mongod"
