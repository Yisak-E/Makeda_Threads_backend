#!/bin/bash
# MongoDB Installation Script for WSL Ubuntu

echo "📦 Installing MongoDB on WSL..."

# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Reload local package database
sudo apt-get update

# Install MongoDB packages
sudo apt-get install -y mongodb-org

# Create data directory
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

echo "✅ MongoDB installed!"
echo ""
echo "To start MongoDB, run:"
echo "  sudo mongod --dbpath /data/db --fork --logpath /var/log/mongodb.log"
echo ""
echo "To check if running:"
echo "  ps aux | grep mongod"
