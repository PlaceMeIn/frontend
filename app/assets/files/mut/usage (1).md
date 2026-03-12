I'll create a comprehensive API usage guide for your **Takeaways**, **Likes**, and **Shares** endpoints based on your models and serializers.

---

## **TAKEAWAYS API GUIDE**

### **Model Overview**
Takeaways are user notes/reflections about events or projects they've engaged with.

---

### **GET /api/takeaways/** - List All Takeaways
**URL:** `{{base_url}}/api/takeaways/`

**Filter Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `?event={uuid}` | Filter by event | `{{base_url}}/api/takeaways/?event=123e4567-e89b-12d3-a456-426614174000` |
| `?project={uuid}` | Filter by project | `{{base_url}}/api/takeaways/?project=123e4567-e89b-12d3-a456-426614174001` |
| `?is_public=true` | Show only public takeaways | `{{base_url}}/api/takeaways/?is_public=true` |
| `?user={uuid}` | Filter by user (admin) | `{{base_url}}/api/takeaways/?user=123e4567-e89b-12d3-a456-426614174002` |
| `?ordering=-created_at` | Newest first | `{{base_url}}/api/takeaways/?ordering=-created_at` |

**Response (200 OK):**
```json
{
    "count": 15,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "user": "123e4567-e89b-12d3-a456-426614174001",
            "user_name": "Jane Wanjiku",
            "user_email": "jane@example.com",
            "event": "123e4567-e89b-12d3-a456-426614174002",
            "event_title": "Annual Tech Summit 2026",
            "project": null,
            "project_title": null,
            "content": "Learned so much about AI implementation in African contexts!",
            "is_public": true,
            "created_at": "2026-03-15T10:30:00Z",
            "updated_at": "2026-03-15T10:30:00Z"
        }
    ]
}
```

---

### **GET /api/takeaways/{id}/** - Get Single Takeaway
**URL:** `{{base_url}}/api/takeaways/123e4567-e89b-12d3-a456-426614174000/`

---

### **POST /api/takeaways/** - Create Takeaway
**URL:** `{{base_url}}/api/takeaways/`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON) - For Event:**
```json
{
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "content": "The workshop on machine learning was incredibly practical. I learned how to build a recommendation system from scratch!",
    "is_public": true
}
```

**Body (JSON) - For Project:**
```json
{
    "project": "123e4567-e89b-12d3-a456-426614174001",
    "content": "Contributing to this open-source project taught me the importance of code reviews and documentation.",
    "is_public": false
}
```

**Validation Rules:**
- ❌ Cannot set both `event` and `project` (choose one)
- ❌ Must provide either `event` OR `project`
- ❌ User can only have ONE takeaway per event/project

**Response (201 Created):**
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "user_name": "Jane Wanjiku",
    "user_email": "jane@example.com",
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "event_title": "Annual Tech Summit 2026",
    "project": null,
    "project_title": null,
    "content": "The workshop on machine learning was incredibly practical...",
    "is_public": true,
    "created_at": "2026-03-15T10:30:00Z",
    "updated_at": "2026-03-15T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
    "non_field_errors": ["You already have a takeaway for this event"]
}
```

---

### **PUT/PATCH /api/takeaways/{id}/** - Update Takeaway
**URL:** `{{base_url}}/api/takeaways/123e4567-e89b-12d3-a456-426614174003/`

**Headers:** `Authorization: Bearer {{access_token}}`

**Body (JSON):**
```json
{
    "content": "Updated: The ML workshop was fantastic! Built a movie recommender.",
    "is_public": true
}
```

> ⚠️ **Note:** Cannot change `event` or `project` after creation

---

### **DELETE /api/takeaways/{id}/** - Delete Takeaway
**URL:** `{{base_url}}/api/takeaways/123e4567-e89b-12d3-a456-426614174003/`

**Headers:** `Authorization: Bearer {{access_token}}`

**Response:** 204 No Content

---

### **GET /api/takeaways/my_takeaways/** - Current User's Takeaways
**URL:** `{{base_url}}/api/takeaways/my_takeaways/`

**Headers:** `Authorization: Bearer {{access_token}}`

**Response:** List of takeaways for authenticated user

---

### **GET /api/takeaways/by_event/?event={uuid}** - Takeaways for Specific Event
**URL:** `{{base_url}}/api/takeaways/by_event/?event=123e4567-e89b-12d3-a456-426614174000`

**Query Parameters:**
- `?is_public=true` - Only public takeaways

---

### **GET /api/takeaways/by_project/?project={uuid}** - Takeaways for Specific Project
**URL:** `{{base_url}}/api/takeaways/by_project/?project=123e4567-e89b-12d3-a456-426614174001`

---

## **LIKES API GUIDE**

### **Model Overview**
One-click likes for events and projects. Users can like either an event OR a project, not both.

---

### **GET /api/likes/** - List All Likes (Admin)
**URL:** `{{base_url}}/api/likes/`

**Filter Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `?event={uuid}` | Likes for specific event | `{{base_url}}/api/likes/?event=123e4567-e89b-12d3-a456-426614174000` |
| `?project={uuid}` | Likes for specific project | `{{base_url}}/api/likes/?project=123e4567-e89b-12d3-a456-426614174001` |
| `?user={uuid}` | Likes by specific user | `{{base_url}}/api/likes/?user=123e4567-e89b-12d3-a456-426614174002` |

**Response (200 OK):**
```json
{
    "count": 150,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174010",
            "user": "123e4567-e89b-12d3-a456-426614174001",
            "user_name": "Jane Wanjiku",
            "event": "123e4567-e89b-12d3-a456-426614174000",
            "event_title": "Annual Tech Summit 2026",
            "project": null,
            "project_title": null,
            "created_at": "2026-03-15T10:30:00Z"
        }
    ]
}
```

---

### **POST /api/likes/** - Create Like (Like Event/Project)
**URL:** `{{base_url}}/api/likes/`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON) - Like Event:**
```json
{
    "event": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Body (JSON) - Like Project:**
```json
{
    "project": "123e4567-e89b-12d3-a456-426614174001"
}
```

**Validation Rules:**
- ❌ Cannot like both event and project at once
- ❌ Cannot like same item twice (duplicate prevention)
- ✅ Must be authenticated

**Response (201 Created):**
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174010",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "user_name": "Jane Wanjiku",
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "event_title": "Annual Tech Summit 2026",
    "project": null,
    "project_title": null,
    "created_at": "2026-03-15T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
    "non_field_errors": ["You already liked this event"]
}
```

---

### **DELETE /api/likes/{id}/** - Unlike (Delete Like)
**URL:** `{{base_url}}/api/likes/123e4567-e89b-12d3-a456-426614174010/`

**Headers:** `Authorization: Bearer {{access_token}}`

**Response:** 204 No Content

---

### **GET /api/likes/my_likes/** - Current User's Likes
**URL:** `{{base_url}}/api/likes/my_likes/`

**Headers:** `Authorization: Bearer {{access_token}}`

---

### **GET /api/likes/count/?event={uuid}** - Get Like Count for Event
**URL:** `{{base_url}}/api/likes/count/?event=123e4567-e89b-12d3-a456-426614174000`

**Response:**
```json
{
    "count": 45,
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "event_title": "Annual Tech Summit 2026"
}
```

---

### **GET /api/likes/count/?project={uuid}** - Get Like Count for Project
**URL:** `{{base_url}}/api/likes/count/?project=123e4567-e89b-12d3-a456-426614174001`

---

### **GET /api/likes/has_liked/?event={uuid}** - Check if User Liked Event
**URL:** `{{base_url}}/api/likes/has_liked/?event=123e4567-e89b-12d3-a456-426614174000`

**Headers:** `Authorization: Bearer {{access_token}}`

**Response:**
```json
{
    "has_liked": true,
    "like_id": "123e4567-e89b-12d3-a456-426614174010"
}
```

---

## **SHARES API GUIDE**

### **Model Overview**
Track when users share events/projects via different platforms (social media, copy link, email).

---

### **GET /api/shares/** - List All Shares (Admin)
**URL:** `{{base_url}}/api/shares/`

**Filter Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `?event={uuid}` | Shares for specific event | `{{base_url}}/api/shares/?event=123e4567-e89b-12d3-a456-426614174000` |
| `?project={uuid}` | Shares for specific project | `{{base_url}}/api/shares/?project=123e4567-e89b-12d3-a456-426614174001` |
| `?platform=twitter` | Filter by platform | `{{base_url}}/api/shares/?platform=twitter` |
| `?user={uuid}` | Shares by specific user | `{{base_url}}/api/shares/?user=123e4567-e89b-12d3-a456-426614174002` |

**Platform Options:** `copy_link`, `twitter`, `facebook`, `linkedin`, `whatsapp`, `email`, `other`

**Response (200 OK):**
```json
{
    "count": 89,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174020",
            "user": "123e4567-e89b-12d3-a456-426614174001",
            "user_name": "Jane Wanjiku",
            "event": "123e4567-e89b-12d3-a456-426614174000",
            "event_title": "Annual Tech Summit 2026",
            "project": null,
            "project_title": null,
            "platform": "twitter",
            "created_at": "2026-03-15T10:30:00Z"
        }
    ]
}
```

---

### **POST /api/shares/** - Record a Share
**URL:** `{{base_url}}/api/shares/`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON) - Share Event:**
```json
{
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "twitter"
}
```

**Body (JSON) - Share Project:**
```json
{
    "project": "123e4567-e89b-12d3-a456-426614174001",
    "platform": "copy_link"
}
```

**Platform Options:**
| Platform | Description |
|----------|-------------|
| `copy_link` | User copied the link |
| `twitter` | Shared on Twitter/X |
| `facebook` | Shared on Facebook |
| `linkedin` | Shared on LinkedIn |
| `whatsapp` | Shared via WhatsApp |
| `email` | Shared via Email |
| `other` | Other platform |

**Response (201 Created):**
```json
{
    "id": "123e4567-e89b-12d3-a456-426614174020",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "user_name": "Jane Wanjiku",
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "event_title": "Annual Tech Summit 2026",
    "project": null,
    "project_title": null,
    "platform": "twitter",
    "created_at": "2026-03-15T10:30:00Z"
}
```

---

### **GET /api/shares/statistics/** - Share Statistics
**URL:** `{{base_url}}/api/shares/statistics/`

**Query Parameters:**
- `?event={uuid}` - Statistics for specific event
- `?project={uuid}` - Statistics for specific project

**Response:**
```json
{
    "total_shares": 89,
    "by_platform": [
        {"platform": "copy_link", "count": 45},
        {"platform": "twitter", "count": 23},
        {"platform": "whatsapp", "count": 12},
        {"platform": "linkedin", "count": 6},
        {"platform": "facebook", "count": 3}
    ],
    "event": "123e4567-e89b-12d3-a456-426614174000",
    "event_title": "Annual Tech Summit 2026"
}
```

---

### **GET /api/shares/my_shares/** - Current User's Share History
**URL:** `{{base_url}}/api/shares/my_shares/`

**Headers:** `Authorization: Bearer {{access_token}}`

---


