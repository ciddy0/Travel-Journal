use axum::Json;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Location {
    x: f64,
    y: f64,
    city: String,
    country: String,
    id: Option<String>,
}

pub async fn location_get() -> Json<Location> {
    Json::from(Location {
        x: 40.7128,
        y: -74.0060,
        city: "New York".to_string(),
        country: "USA".to_string(),
        id: Some(uuid::Uuid::new_v4().to_string()),
    })
}

pub async fn location_post(Json(mut l): Json<Location>) -> Json<Location> {
    println!("Location: {0}, {1}, {2}, {3}", l.x, l.y, l.city, l.country);
    l.id = Some(uuid::Uuid::new_v4().to_string());
    Json::from(l)
}
