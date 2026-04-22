# Preevol ERP - User Credentials

**Generated:** Auto-generated user accounts for testing

---

## User Roles Explained

| Role | Description | Permissions |
|------|-------------|-------------|
| **Owner** | Full system access | All permissions including company settings |
| **Admin** | Manage data | Can create/edit/delete most entities |
| **User** | Basic access | Can view and create basic transactions |

---

## Complete Users Table

| # | Email | Password | Name | Role | Status |
|---|-------|----------|------|------|--------|
| 1 | `admin@admin.com` | `admin123` | Preevol Techinite Admin | Owner | ✅ Default |
| 2 | `owner@erp.com` | `Owner@123456` | Owner User | Owner | ✅ Script |
| 3 | `admin@erp.com` | `Admin@123456` | Admin User | Admin | ✅ Script |
| 4 | `manager@erp.com` | `Manager@123456` | Manager User | Admin | ✅ Script |
| 5 | `user@erp.com` | `User@123456` | Regular User | User | ✅ Script |
| 6 | `accountant@erp.com` | `Accountant@123456` | Accountant User | User | ✅ Script |

---

## Default System Account

| Email | Password | Name | Role |
|-------|----------|------|------|
| `admin@admin.com` | `admin123` | Preevol Techinite Admin | Owner |

---

## Additional User Accounts (All Roles)

### Owner Account (Full Access)
| Email | Password | Name | Role |
|-------|----------|------|------|
| `owner@erp.com` | `Owner@123456` | Owner User | Owner |

### Admin Accounts (Manage Data)
| Email | Password | Name | Role |
|-------|----------|------|------|
| `admin@erp.com` | `Admin@123456` | Admin User | Admin |
| `manager@erp.com` | `Manager@123456` | Manager User | Admin |

### User Accounts (Basic Access)
| Email | Password | Name | Role |
|-------|----------|------|------|
| `user@erp.com` | `User@123456` | Regular User | User |
| `accountant@erp.com` | `Accountant@123456` | Accountant User | User |

---

## Quick Reference

```
Owner Login:
  Email: owner@erp.com
  Password: Owner@123456

Admin Login:
  Email: admin@erp.com
  Password: Admin@123456

User Login:
  Email: user@erp.com
  Password: User@123456
```

---

## How to Create Users

### Option 1: Via User Management Page (Frontend)
1. Login as Owner or Admin
2. Navigate to **Masters > User Management**
3. Click "Add New" button
4. Fill in user details and password
5. Select appropriate role
6. Save

### Option 2: Via Backend Script

From the `backend` directory:
```bash
node src/setup/createAllUsers.js
```

This script creates all test users listed above.

### Option 3: Direct Database (MongoDB)

```javascript
// Connect to MongoDB and insert admin document
// Password must be hashed using AdminPassword.generateHash()
```

---

## API Endpoints

### Login
```bash
curl -X POST http://localhost:8888/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "admin123"
  }'
```

### Create User (requires auth token)
```bash
curl -X POST http://localhost:8888/api/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "newuser@erp.com",
    "name": "New",
    "surname": "User",
    "role": "user",
    "enabled": true
  }'
```

---

## Security Notes

⚠️ **IMPORTANT:** 
- Change default passwords in production
- Use strong passwords (min 8 chars, mixed case, numbers, symbols)
- Enable email verification for production
- Restrict Owner role to trusted personnel only

---

## User Management Page

Access the user management interface at:
- URL: `/user` (when logged in)
- Navigation: **Masters > User Management**

Features:
- Create new users
- Edit user details
- Enable/disable users
- Delete users
- View all users in a list

---

*Last updated: Auto-generated*
