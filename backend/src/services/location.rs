use crate::models::location::{CreateLocationRequest, Location};
use sqlx::PgPool;

#[derive(Clone)]
pub struct LocationService {
    pool: PgPool,
}

impl LocationService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_location(&self, req: CreateLocationRequest) -> sqlx::Result<Location> {
        let location = sqlx::query_as::<_, Location>(
            r#"
            INSERT INTO locations (x, y, city, country, title, description, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, x, y, city, country, title, description, image_url, created_at, updated_at
            "#,
        )
        .bind(req.x)
        .bind(req.y)
        .bind(req.city)
        .bind(req.country)
        .bind(req.title)
        .bind(req.description)
        .bind(req.image_url)
        .fetch_one(&self.pool)
        .await?;

        Ok(location)
    }

    pub async fn get_all_locations(&self) -> Result<Vec<Location>, sqlx::Error> {
        let locations =
            sqlx::query_as::<_, Location>("SELECT * FROM locations ORDER BY created_at DESC")
                .fetch_all(&self.pool)
                .await?;

        Ok(locations)
    }

    pub async fn get_location_by_id(
        &self,
        id: uuid::Uuid,
    ) -> Result<Option<Location>, sqlx::Error> {
        let location = sqlx::query_as::<_, Location>("SELECT * FROM locations WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;

        Ok(location)
    }
}
