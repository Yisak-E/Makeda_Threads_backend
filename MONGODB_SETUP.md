# 🗄️ MongoDB Setup Guide for Makeda Threads

## ⚠️ Problem
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Cause:** MongoDB is not running locally.

---

## ✅ Solutions (Choose One)

### 🌩️ **Option 1: MongoDB Atlas (Recommended - Cloud)**

**Pros:** No installation, always available, free tier, automatic backups  
**Cons:** Requires internet connection

#### Steps:

1. **Sign up for MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region (closest to you)
   - Click "Create"

3. **Set up Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set role: "Read and write to any database"

4. **Set up Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`

6. **Update `.env` file**
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/makeda-threads?retryWrites=true&w=majority
   ```
   
   **Replace:**
   - `YOUR_USERNAME` with your database user
   - `YOUR_PASSWORD` with your password
   - `cluster0.xxxxx.mongodb.net` with your cluster URL

7. **Start your app**
   ```bash
   npm run start:dev
   ```

---

### 🐧 **Option 2: Install MongoDB on WSL/Ubuntu**

**Pros:** Full control, no internet needed after setup  
**Cons:** Requires installation, manual start/stop

#### Quick Install:

```bash
# Make install script executable
chmod +x scripts/install-mongodb-wsl.sh

# Run installation
./scripts/install-mongodb-wsl.sh
```

#### Manual Installation Steps:

```bash
# 1. Import MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Update packages
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Create data directory
sudo mkdir -p /data/db
sudo chown -R $USER /data/db
```

#### Start MongoDB:

```bash
# Quick start (using script)
chmod +x scripts/start-mongodb.sh
./scripts/start-mongodb.sh

# OR manual start
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongodb.log
```

#### Verify MongoDB is Running:

```bash
# Check process
ps aux | grep mongod

# Connect using mongo shell
mongosh
# Should show: "Connected to: mongodb://127.0.0.1:27017"
```

#### Stop MongoDB:

```bash
sudo pkill mongod
```

#### Update `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/makeda-threads
```

---

### 🐳 **Option 3: Docker (Alternative)**

**Pros:** Isolated, easy start/stop, consistent environment  
**Cons:** Requires Docker installation

#### Install Docker Desktop for Windows:
https://www.docker.com/products/docker-desktop/

#### Run MongoDB Container:

```bash
# Start MongoDB in Docker
docker run -d \
  --name makeda-mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Check if running
docker ps

# View logs
docker logs makeda-mongodb

# Stop MongoDB
docker stop makeda-mongodb

# Start MongoDB (after stopping)
docker start makeda-mongodb

# Remove container
docker rm makeda-mongodb
```

#### Update `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/makeda-threads
```

---

## 🧪 Test Your Connection

After setting up MongoDB with any option above:

```bash
# 1. Start your NestJS app
npm run start:dev

# 2. You should see:
# [Nest] INFO [InstanceLoader] MongooseModule dependencies initialized
# [Nest] INFO [RoutesResolver] Mapped {/api/v1/auth/register, POST} route
# 🚀 Application is running on: http://localhost:3000/api/v1

# 3. Seed database
npm run seed

# 4. Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@makedathreads.com","password":"Password123"}'
```

---

## 🔧 Troubleshooting

### Issue: "command not found: mongod"
**Solution:** MongoDB not installed. Use Option 1 (Atlas) or complete Option 2 installation.

### Issue: "ECONNREFUSED" even after starting MongoDB
**Solution:** 
```bash
# Check if MongoDB is actually running
ps aux | grep mongod

# Check which port it's using
sudo netstat -tlnp | grep mongod

# Make sure .env has correct connection string
cat .env | grep MONGODB_URI
```

### Issue: Atlas connection timeout
**Solution:** 
- Check internet connection
- Verify Network Access allows your IP
- Check connection string format (no < > brackets)
- Ensure password is URL-encoded (replace special chars)

### Issue: "Authentication failed" with Atlas
**Solution:**
- Verify username and password in Database Access
- Check connection string has correct credentials
- Password might need URL encoding (e.g., @ becomes %40)

---

## 📋 Quick Reference

### MongoDB Atlas Connection String Format:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Local MongoDB Connection String:
```
mongodb://localhost:27017/makeda-threads
```

### Docker MongoDB Connection String:
```
mongodb://localhost:27017/makeda-threads
```

---

## 🎯 Recommended Setup

**For Development:** MongoDB Atlas (Option 1)
- Fastest to set up
- No maintenance
- Works from anywhere

**For Production:** MongoDB Atlas with paid tier
- Better performance
- Automatic backups
- Monitoring tools

**For Learning/Testing:** Local Install (Option 2)
- Learn MongoDB administration
- Work offline
- Full control

---

## 🚀 After MongoDB is Running

```bash
# Start backend
npm run start:dev

# Seed database
npm run seed

# Test authentication
# See: test/auth.http for API tests
```

---

## 📞 Need Help?

1. **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
2. **MongoDB Community:** https://www.mongodb.com/community/forums/
3. **Check our AUTH_GUIDE.md** for API testing

---

**Current Status:** MongoDB connection required before running the application.  
**Recommended:** Start with MongoDB Atlas (5 minutes setup)
