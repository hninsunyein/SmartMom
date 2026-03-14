# Smart Mom System — API Documentation

**Base URL:** `http://localhost:5000/api`
**Auth:** Bearer JWT token in `Authorization` header (except login/register endpoints)
**Content-Type:** `application/json`

---

## Authentication

### POST `/auth/register/parent`
Register a new parent account.

**Request Body:**
```json
{
  "fullName": "Sarah Johnson",
  "email": "sarah@example.com",
  "phone": "09123456789",
  "age": 32,
  "password": "yourpassword"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Parent registered successfully",
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "email": "sarah@example.com",
    "fullName": "Sarah Johnson",
    "userType": "parent",
    "age": 32
  }
}
```

---

### POST `/auth/register/advisor`
Register an advisor account (requires admin approval before login).

**Request Body:**
```json
{
  "fullName": "Dr. May Thu Win",
  "email": "dr.may@example.com",
  "phone": "09123456789",
  "specialty": "Child Nutrition",
  "licenseNumber": "MN-12345-2023",
  "experienceYears": 8,
  "password": "yourpassword",
  "availability": [
    { "dayOfWeek": "monday", "startTime": "09:00", "endTime": "12:00" },
    { "dayOfWeek": "monday", "startTime": "14:00", "endTime": "17:00" },
    { "dayOfWeek": "wednesday", "startTime": "09:00", "endTime": "12:00" },
    { "dayOfWeek": "friday", "startTime": "09:00", "endTime": "12:00" }
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Advisor registration submitted for approval",
  "user": {
    "id": 2,
    "email": "dr.may@example.com",
    "fullName": "Dr. May Thu Win",
    "userType": "advisor",
    "specialty": "Child Nutrition",
    "approvalStatus": "pending"
  }
}
```

---

### POST `/auth/login`
Login for both parents and advisors.

**Request Body:**
```json
{
  "email": "sarah@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "email": "sarah@example.com",
    "fullName": "Sarah Johnson",
    "userType": "parent",
    "approvalStatus": "approved"
  }
}
```

> **Note:** Advisors with `approvalStatus: "pending"` will receive `403 Forbidden`.

---

### GET `/auth/me` 🔒
Get the current logged-in user's profile.

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "sarah@example.com",
    "fullName": "Sarah Johnson",
    "userType": "parent",
    "age": 32,
    "phone": "09123456789"
  }
}
```

---

### POST `/auth/forgot-password`
Request a password reset link (sent to console in development).

**Request Body:**
```json
{ "email": "sarah@example.com" }
```

**Response `200`:**
```json
{
  "success": true,
  "message": "If this email exists, a reset link has been sent.",
  "resetToken": "abc123...",
  "resetUrl": "http://localhost:3000/reset-password?token=abc123..."
}
```

---

### POST `/auth/reset-password`
Reset password using the token from the forgot-password response.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "newpassword"
}
```

**Response `200`:**
```json
{ "success": true, "message": "Password has been reset successfully." }
```

---

## Children

All endpoints require `Authorization: Bearer <token>` (parent role).

### GET `/children` 🔒
List all children belonging to the logged-in parent.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "parentId": 1,
      "name": "Suu Suu",
      "dateOfBirth": "2021-03-15",
      "gender": "female",
      "bloodType": "O+",
      "allergies": "Peanuts",
      "medicalConditions": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST `/children` 🔒
Create a new child profile.

**Request Body:**
```json
{
  "name": "Suu Suu",
  "dateOfBirth": "2021-03-15",
  "gender": "female",
  "bloodType": "O+",
  "allergies": "Peanuts",
  "medicalConditions": ""
}
```

**Response `201`:**
```json
{ "success": true, "data": { "id": 1, "name": "Suu Suu", ... } }
```

---

### GET `/children/:id` 🔒
Get a specific child by ID. Only accessible by the child's parent.

---

### PUT `/children/:id` 🔒
Update a child's profile. Only accessible by the child's parent.

**Request Body:** (any fields to update)
```json
{ "name": "Suu Suu Updated", "allergies": "None" }
```

---

### DELETE `/children/:id` 🔒
Delete a child profile. Only accessible by the child's parent.

**Response `200`:**
```json
{ "success": true, "message": "Child deleted" }
```

---

## Growth Tracking

### GET `/growth/child/:childId` 🔒
Get all growth measurements for a child, ordered by date ascending.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "childId": 1,
      "measurementDate": "2025-06-01",
      "height": 95.5,
      "weight": 14.2,
      "bmi": 15.56,
      "headCircumference": null,
      "notes": null
    }
  ]
}
```

---

### POST `/growth` 🔒
Add a new growth measurement. BMI is auto-calculated from height and weight.

**Request Body:**
```json
{
  "childId": 1,
  "measurementDate": "2025-10-23",
  "height": 101.0,
  "weight": 16.5,
  "notes": "Monthly checkup"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "childId": 1,
    "measurementDate": "2025-10-23",
    "height": 101.0,
    "weight": 16.5,
    "bmi": 16.18
  }
}
```

---

## Nutrition

### POST `/nutrition/calculate` 🔒
Calculate calories for a food item and amount.

**Request Body:**
```json
{ "foodItem": "rice", "amount": 150 }
```

**Available food items:** `rice`, `bread`, `noodles`, `egg`, `chicken`, `fish`, `milk`, `banana`, `apple`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "foodItem": "rice",
    "amount": 150,
    "caloriesPer100": 130,
    "totalCalories": 195
  }
}
```

---

### POST `/nutrition/generate` 🔒
Generate a meal plan based on age group and goals.

**Request Body:**
```json
{
  "ageGroup": "3-5",
  "goals": ["weight_gain", "height_growth"]
}
```

**Available ageGroups:** `0-2`, `3-5`, `6-12`, `13-18`
**Available goals:** `weight_gain`, `height_growth`, `immunity_boost`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "ageGroup": "3-5",
    "goals": ["weight_gain", "height_growth"],
    "breakfast": [
      "Milk + Banana + Oatmeal",
      "Eggs + Toast + Orange Juice",
      "Milk + Egg + Whole Grain Toast"
    ],
    "lunch": [
      "Rice + Chicken Curry + Vegetables",
      "Rice + Fish + Spinach",
      "Pasta + Meat Sauce + Salad"
    ],
    "dinner": [
      "Rice + Fish + Soup",
      "Chicken Stew + Bread + Vegetables",
      "Chicken Soup + Bread + Salad"
    ]
  }
}
```

---

### GET `/nutrition/plans/child/:childId` 🔒
Get all saved nutrition plans for a child.

---

### POST `/nutrition/plans` 🔒
Save a nutrition plan for a child.

**Request Body:**
```json
{
  "childId": 1,
  "planDate": "2025-10-23",
  "ageGroup": "3-5",
  "goals": ["weight_gain"],
  "breakfast": "Milk + Banana + Oatmeal",
  "lunch": "Rice + Fish + Vegetables",
  "dinner": "Chicken Soup + Bread"
}
```

---

## Appointments

### GET `/appointments` 🔒
Get appointments for the current user.
- **Parents:** Returns appointments they booked
- **Advisors:** Returns appointments assigned to them

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "parentId": 1,
      "advisorId": 2,
      "childId": 1,
      "appointmentDate": "2025-10-28",
      "appointmentTime": "10:00",
      "timeSlot": "morning",
      "status": "pending",
      "reason": "Nutrition consultation",
      "parent": { "id": 1, "fullName": "Sarah Johnson" },
      "advisor": { "id": 2, "fullName": "Dr. May Thu Win" },
      "child": { "id": 1, "name": "Suu Suu" }
    }
  ]
}
```

---

### POST `/appointments` 🔒
Book a new appointment (parent only).

**Request Body:**
```json
{
  "advisorId": 2,
  "childId": 1,
  "appointmentDate": "2025-10-28",
  "appointmentTime": "10:00",
  "timeSlot": "morning",
  "reason": "Nutrition consultation"
}
```

**timeSlot values:** `"morning"` (09:00–12:00) or `"evening"` (14:00–17:00)

---

### PUT `/appointments/:id/approve` 🔒
Approve a pending appointment (advisor only).

**Response `200`:**
```json
{ "success": true, "data": { "id": 1, "status": "confirmed", ... } }
```

---

### PUT `/appointments/:id/reject` 🔒
Reject an appointment (advisor only).

---

### PUT `/appointments/:id/cancel` 🔒
Cancel an appointment (parent only).

---

## Advisors

### GET `/advisors` 🔒
Get all approved advisors with their availability schedules.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "fullName": "Dr. May Thu Win",
      "specialty": "Child Nutrition",
      "phone": "09123456789",
      "experienceYears": 8,
      "availability": [
        { "id": 1, "dayOfWeek": "monday", "startTime": "09:00", "endTime": "12:00" },
        { "id": 2, "dayOfWeek": "monday", "startTime": "14:00", "endTime": "17:00" },
        { "id": 3, "dayOfWeek": "wednesday", "startTime": "09:00", "endTime": "12:00" }
      ]
    }
  ]
}
```

---

### GET `/advisors/pending` 🔒
Get all advisors awaiting admin approval (admin use).

---

### GET `/advisors/:id` 🔒
Get a single advisor by ID with their availability.

---

### PUT `/advisors/:id/approve` 🔒
Approve an advisor's account (admin only).

**Response `200`:**
```json
{ "success": true, "message": "Advisor approved" }
```

---

### PUT `/advisors/:id/reject` 🔒
Reject an advisor's account (admin only).

---

## Tips

### GET `/tips` 🔒
Get tips with optional filters.

**Query Parameters:**
| Param | Values | Description |
|-------|--------|-------------|
| `type` | `safety`, `health` | Filter by tip type |
| `ageGroup` | `All Ages`, `0-2 years`, `3-5 years`, `6-12 years` | Filter by age group |

**Example:** `GET /tips?type=safety&ageGroup=0-2 years`

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "safety",
      "title": "Child-proof Your Home",
      "category": "Home Safety",
      "content": "Install safety gates, cover electrical outlets...",
      "ageGroup": "All Ages",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST `/tips` 🔒
Create a new tip (admin only).

**Request Body:**
```json
{
  "type": "safety",
  "title": "Swimming Safety",
  "category": "Outdoor Safety",
  "content": "Never leave children unattended near water...",
  "ageGroup": "3-5 years"
}
```

**type values:** `safety` or `health`
**Safety categories:** `Home Safety`, `Outdoor Safety`, `Food Safety`, `Travel Safety`
**Health categories:** `Vaccination`, `Nutrition`, `Sleep & Rest`, `Physical Activity`, `Dental Health`

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found |
| `409` | Conflict — e.g., email already registered |
| `500` | Internal Server Error |

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Parent | `parent@test.com` | `password` |
| Advisor | `advisor@test.com` | `password` |

---

## Quick Start

```bash
# 1. Start the full stack with Docker
npm run build

# 2. Or run individually in development
npm run dev:backend   # NestJS on :5000
npm run dev:frontend  # Next.js on :3000

# 3. Test the API health
curl http://localhost:5000/api/health
```
