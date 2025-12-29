use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, FromRow, Serialize, Clone)]
pub struct Location {
    pub id: uuid::Uuid,
    pub x: f64,
    pub y: f64,
    pub city: String,
    pub country: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

// API request DTO - what users send
#[derive(Debug, Deserialize)]
pub struct CreateLocationRequest {
    pub x: f64,
    pub y: f64,
    pub city: String,
    pub country: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
}

// API response DTO - what users receive
#[derive(Debug, Serialize)]
pub struct LocationResponse {
    pub id: String,
    pub x: f64,
    pub y: f64,
    pub city: String,
    pub country: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub created_at: String,
}

// conversion
impl From<Location> for LocationResponse {
    fn from(location: Location) -> Self {
        Self {
            id: location.id.to_string(),
            x: location.x,
            y: location.y,
            city: location.city,
            country: location.country,
            title: location.title,
            description: location.description,
            image_url: location.image_url,
            created_at: location.created_at.to_rfc3339(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateLocationRequest {
    pub x: Option<f64>,
    pub y: Option<f64>,
    pub city: Option<String>,
    pub country: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub image_url: Option<String>,
}
